import SubjectsGrid from "./SubjectsGrid";

type Props = {};

function Dashboard({ }: Props) {
  return (
    <div className="flex w-full flex-col">
      <SubjectsGrid />
    </div>
  );
}

export default Dashboard;
