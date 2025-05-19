/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button, Group, Radio, RangeSlider, Stack, Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { UserActionType } from '../utils/Enums';
import { useMatrixContext } from '../utils/MatrixContext';
import { ClusterMark } from '../utils/Interfaces';

function ClearAndResetButtons() {
  const {
    setAnswerNodes, trrack, actions, setAnswer,
  } = useMatrixContext();

  return (
    <Button
      size="s"
      onClick={() => {
        setAnswerNodes([]);
        trrack?.apply('Set Answer', actions?.setAnswerNodes([]));
        setAnswer({
          status: true,
          provenanceGraph: trrack?.graph.backend,
          answers: { answerNodes: [] },
        });
      }}
    >
      {UserActionType.ClearNodeSelection}
    </Button>
  );
}

function PathSelection() {
  const { setLinkMarks } = useMatrixContext();
  return (
    <Stack gap="5vh">
      <Button
        size="s"
        onClick={() => {
          setLinkMarks([]);
        }}
      >
        {UserActionType.ClearLinkSelection}
      </Button>
    </Stack>
  );
}

export function InteractionButtons() {
  return (
    <Stack>
      <PathSelection />
      <ClearAndResetButtons />
    </Stack>
  );
}
