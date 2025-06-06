import { Button, Stack } from '@mantine/core';
import { UserActionType } from '../utils/Enums';
import { useMatrixContext } from '../utils/MatrixContext';

function ClearAndResetButtons() {
  const {
    setAnswerNodes, trrack, actions, setAnswer,
  } = useMatrixContext();

  return (
    <Button
      style={{ width: '50%' }}
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
    <Button
      style={{ width: '50%' }}
      onClick={() => {
        setLinkMarks([]);
      }}
    >
      {UserActionType.ClearLinkSelection}
    </Button>
  );
}

export function InteractionButtons() {
  return (
    <Stack style={{ display: 'flex', justifyContent: 'center' }}>
      <PathSelection />
      <ClearAndResetButtons />
    </Stack>
  );
}
