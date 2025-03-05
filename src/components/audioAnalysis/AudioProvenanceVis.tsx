/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box, Center, Group, Loader, Stack,
} from '@mantine/core';
import { useSearchParams } from 'react-router';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useResizeObserver, useThrottledState } from '@mantine/hooks';
import { WaveForm, WaveSurfer } from 'wavesurfer-react';
import * as d3 from 'd3';
import {
  Registry, Trrack, initializeTrrack, isRootNode,
} from '@trrack/core';
import WaveSurferType from 'wavesurfer.js';
import { StorageEngine } from '../../storage/engines/StorageEngine';
import { useCurrentComponent, useCurrentStep } from '../../routes/utils';
import { useStorageEngine } from '../../storage/storageEngineHooks';
import { useAsync } from '../../store/hooks/useAsync';
import { useStoreActions, useStoreDispatch, useStoreSelector } from '../../store/store';
import { WithinTaskTimeline } from './WithinTaskTimeline';
import { useIsAnalysis } from '../../store/hooks/useIsAnalysis';
import { Timer } from './Timer';
import { humanReadableDuration } from '../../utils/humanReadableDuration';
import { ResponseBlockLocation } from '../../parser/types';
import { useUpdateProvenance } from './useUpdateProvenance';
import { useEvent } from '../../store/hooks/useEvent';

const margin = {
  left: 0, top: 0, right: 0, bottom: 0,
};

function getParticipantData(trrackId: string | undefined, storageEngine: StorageEngine | undefined) {
  if (storageEngine) {
    return storageEngine.getParticipantData(trrackId);
  }

  return null;
}

export function AudioProvenanceVis({ setTimeString }: { setTimeString: (time: string) => void }) {
  const [searchParams] = useSearchParams();
  const participantId = useMemo(() => searchParams.get('participantId') || undefined, [searchParams]);

  const { storageEngine } = useStorageEngine();

  const analysisIsPlaying = useStoreSelector((state) => state.analysisIsPlaying);
  const analysisHasAudio = useStoreSelector((state) => state.analysisHasAudio);

  const {
    saveAnalysisState, setAnalysisHasAudio, setAnalysisIsPlaying,
  } = useStoreActions();
  const storeDispatch = useStoreDispatch();

  const currentComponent = useCurrentComponent();
  const currentStep = useCurrentStep();
  useEffect(() => { storeDispatch(saveAnalysisState({ prov: undefined, location: 'stimulus' })); }, [currentStep, saveAnalysisState, storeDispatch]);

  const [ref, { width }] = useResizeObserver();
  const [waveSurferWidth, setWaveSurferWidth] = useState<number>(0);

  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [currentResponseNodes, setCurrentResponseNodes] = useState<Record<ResponseBlockLocation, string | undefined>>({
    aboveStimulus: undefined,
    belowStimulus: undefined,
    sidebar: undefined,
    stimulus: undefined,
  });
  const [currentGlobalNode, setCurrentGlobalNode] = useState<{name: string, time: number} | null>(null);

  const [totalAudioLength, setTotalAudioLength] = useState<number>(0);

  const { value: participant, status } = useAsync(getParticipantData, [participantId, storageEngine]);

  const [playTime, setPlayTime] = useThrottledState<number>(0, 100); // 100ms throttle to prevent re-rendering the AnalysisPopout too often

  const waveSurferDiv = useRef(null);

  const [waveSurferLoading, setWaveSurferLoading] = useState<boolean>(true);

  const trrackForTrial = useRef<Trrack<object, string> | null>(null);

  const componentAndIndex = useMemo(() => `${currentComponent}_${currentStep}`, [currentComponent, currentStep]);

  const _setCurrentResponseNodes = useEvent((node: string | null, location: ResponseBlockLocation) => {
    const graph = participant?.answers[componentAndIndex].provenanceGraph[location];
    if (participant && graph && node) {
      if (!currentGlobalNode || graph.nodes[node].createdOn > currentGlobalNode.time || playTime < currentGlobalNode.time) {
        setCurrentGlobalNode({ name: node || '', time: graph.nodes[node].createdOn });
      }
    }

    setCurrentResponseNodes({ ...currentResponseNodes, [location]: node });
  });

  useUpdateProvenance('aboveStimulus', playTime, participant?.answers[componentAndIndex].provenanceGraph.aboveStimulus, currentResponseNodes.aboveStimulus, _setCurrentResponseNodes);

  useUpdateProvenance('belowStimulus', playTime, participant?.answers[componentAndIndex].provenanceGraph.belowStimulus, currentResponseNodes.belowStimulus, _setCurrentResponseNodes);

  useUpdateProvenance('sidebar', playTime, participant?.answers[componentAndIndex].provenanceGraph.sidebar, currentResponseNodes.sidebar, _setCurrentResponseNodes);

  // Make sure we always pause analysis when we change participants or tasks
  useEffect(() => {
    storeDispatch(setAnalysisIsPlaying(false));
  }, [participantId, currentComponent, currentStep, storeDispatch, setAnalysisIsPlaying]);

  // Create an instance of trrack to ensure getState works, incase the saved state is not a full state node.
  useEffect(() => {
    if (componentAndIndex && participant && participant.answers[componentAndIndex]?.provenanceGraph) {
      const reg = Registry.create();

      const trrack = initializeTrrack({ registry: reg, initialState: {} });

      if (participant.answers[componentAndIndex].provenanceGraph.stimulus) {
        trrack.importObject(structuredClone(participant.answers[componentAndIndex].provenanceGraph!.stimulus));

        trrackForTrial.current = trrack;
      }
    }
  }, [participant, componentAndIndex, storeDispatch]);

  const _setCurrentNode = useCallback((node: string | undefined) => {
    if (!node) {
      return;
    }

    if (componentAndIndex && participant && trrackForTrial.current) {
      storeDispatch(saveAnalysisState({ prov: trrackForTrial.current.getState(participant.answers[componentAndIndex].provenanceGraph.stimulus?.nodes[node]), location: 'stimulus' }));

      trrackForTrial.current.to(node);
    }

    _setCurrentResponseNodes(node, 'stimulus');
    setCurrentNode(node);
  }, [componentAndIndex, participant, _setCurrentResponseNodes, storeDispatch, saveAnalysisState]);

  // use effect to control the current provenance node based on the changing playtime.
  useEffect(() => {
    if (!componentAndIndex || !participant || !trrackForTrial.current || !participant.answers[componentAndIndex]?.provenanceGraph) {
      return;
    }
    const provGraph = participant.answers[componentAndIndex].provenanceGraph;

    if (!provGraph.stimulus) {
      return;
    }

    if (!currentNode || !provGraph.stimulus.nodes[currentNode]) {
      _setCurrentNode(provGraph.stimulus.root as string);
      return;
    }

    let tempNode = provGraph.stimulus.nodes[currentNode];

    while (true) {
      if (playTime < tempNode.createdOn) {
        if (!isRootNode(tempNode)) {
          const parentNode = tempNode.parent;

          tempNode = provGraph.stimulus.nodes[parentNode];
        } else break;
      } else if (tempNode.children.length > 0) {
        const child = tempNode.children[0];

        if (playTime > provGraph.stimulus.nodes[child].createdOn) {
          tempNode = provGraph.stimulus.nodes[child];
        } else break;
      } else break;
    }

    if (tempNode.id !== currentNode) {
      _setCurrentNode(tempNode.id);
    }
  }, [_setCurrentNode, currentNode, participant, participantId, playTime, componentAndIndex]);

  const startTime = useMemo(() => participant?.answers[componentAndIndex].startTime || 0, [participant, componentAndIndex]);

  useEffect(() => {
    if (totalAudioLength === 0) {
      setTimeString('');
    } else if (playTime !== 0) {
      setTimeString(`${humanReadableDuration(playTime - startTime)} / ${humanReadableDuration(totalAudioLength * 1000)}`);
    }
  }, [componentAndIndex, participant, playTime, setTimeString, startTime, totalAudioLength]);

  useEffect(() => {
    if (!analysisHasAudio && participant) {
      const length = participant.answers[componentAndIndex].endTime - participant.answers[componentAndIndex].startTime;
      setTotalAudioLength(length > -1 ? length / 1000 : 0);
    }
  }, [analysisHasAudio, componentAndIndex, participant]);

  const isAnalysis = useIsAnalysis();
  const wavesurfer = useRef<WaveSurferType | null>(null);

  const handleWSMount = useCallback(
    async (waveSurfer: WaveSurferType | null) => {
      wavesurfer.current = waveSurfer;
      if (waveSurfer && participant && isAnalysis && componentAndIndex && storageEngine) {
        try {
          const url = await storageEngine.getAudio(componentAndIndex, participantId);
          await waveSurfer.load(url!);
          setWaveSurferLoading(false);
          storeDispatch(setAnalysisHasAudio(true));

          setTotalAudioLength(waveSurfer.getDuration());
          setWaveSurferWidth(waveSurfer.getWidth());
          waveSurfer.seekTo(0);
          waveSurfer.on('redrawcomplete', () => setWaveSurferWidth(waveSurfer.getWidth()));
        } catch (error: any) {
          storeDispatch(setAnalysisHasAudio(false));
          throw new Error(error);
        }
      } else {
        storeDispatch(setAnalysisHasAudio(false));
        setTotalAudioLength(0);
      }
    },
    [participant, isAnalysis, componentAndIndex, storageEngine, participantId, storeDispatch, setAnalysisHasAudio],
  );

  const _setPlayTime = useCallback((n: number, percent: number | undefined) => {
    // if were past the end, pause the timer
    if (n > totalAudioLength * 1000 + startTime) {
      storeDispatch(setAnalysisIsPlaying(false));
      setPlayTime(n);

      return;
    }

    setPlayTime(n);

    if (wavesurfer.current && percent !== undefined) {
      setTimeout(() => {
        wavesurfer.current?.seekTo(percent);
      });
    }
  }, [setAnalysisIsPlaying, setPlayTime, startTime, storeDispatch, totalAudioLength]);

  useEffect(() => {
    if (wavesurfer.current) {
      if (analysisIsPlaying) {
        wavesurfer.current.play();
      } else {
        wavesurfer.current.pause();
      }
    }
  }, [wavesurfer, analysisIsPlaying, totalAudioLength, startTime, setPlayTime]);

  const xScale = useMemo(() => {
    if (!participant || !participant.answers[componentAndIndex]?.startTime || !participant.answers[componentAndIndex]?.endTime) {
      return null;
    }

    const endTime = totalAudioLength > 0 ? participant.answers[componentAndIndex].startTime + totalAudioLength * 1000 : participant.answers[componentAndIndex].endTime;

    const scale = d3.scaleLinear([margin.left, width + margin.left + margin.right]).domain([participant.answers[componentAndIndex].startTime, endTime]).clamp(true);

    return scale;
  }, [participant, componentAndIndex, width, totalAudioLength]);

  useEffect(() => {
    handleWSMount(wavesurfer.current);
  }, [_setPlayTime, handleWSMount, participant, participantId, wavesurfer]);

  return (
    <Group wrap="nowrap" gap={10} mx={10}>
      <Stack ref={ref} style={{ width: '100%' }} gap={0}>
        <Center />
        {participant !== null && componentAndIndex
          ? (
            <Box
              ref={waveSurferDiv}
              style={{
                overflow: 'hidden', width: '100%', pointerEvents: 'none',
              }}
              display={analysisHasAudio ? 'block' : 'none'}
              id="waveformDiv"
            >
              <WaveSurfer onMount={handleWSMount} plugins={[]} container="#waveformDiv" height={50} waveColor="#484848" progressColor="#e15759" barHeight={0} cursorColor="rgba(0, 0, 0, 0)">
                <WaveForm id="waveform" height={50} />
              </WaveSurfer>
              {waveSurferLoading ? <Loader /> : null}
            </Box>
          ) : null}

        {status === 'success' && participant && xScale && componentAndIndex && participant.answers[componentAndIndex].provenanceGraph
          ? (
            <WithinTaskTimeline
              xScale={xScale}
              trialName={componentAndIndex}
              currentNode={currentGlobalNode?.name || ''}
              participantData={participant}
              width={waveSurferWidth || width}
              height={25}
            />
          ) : null}
        {xScale && participant ? <Timer duration={totalAudioLength * 1000} height={(analysisHasAudio ? 50 : 0) + 25} isPlaying={analysisIsPlaying} startTime={startTime} width={width} xScale={xScale} updateTimer={_setPlayTime} /> : null}
      </Stack>
    </Group>
  );
}
