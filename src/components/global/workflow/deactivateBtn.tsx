export default function DeactivateBtn({
  workflowName,
}: {
  workflowName: String;
}) {
  const handler = async () => {
    return null;
  };
  return <span onClick={handler}>Deactivate Workflow</span>;
}
