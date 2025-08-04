import { Button, Stack } from '@mantine/core';
import { UserActionType } from '../utils/Enums';
import { useMatrixContext } from '../utils/MatrixContext';

function ClearAndResetButtons() {
  const {
    setAnswerNodes, trrack, actions, setAnswer,
  } = useMatrixContext();

  return (
    <Button
      variant="filled"
      size="sm"
      styles={{ root: { width: 'fit-content', display: 'inline-flex' } }}
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
      variant="filled"
      size="sm"
      styles={{ root: { width: 'fit-content', display: 'inline-flex' } }}
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
    <Stack style={{ display: 'flex' }}>
      <ClearAndResetButtons />
      <PathSelection />
    </Stack>
  );
}
