"use client";

import { IProject } from "@/app/(root)/types/data";
import { ProjectCard } from "../../cards";

const ProjectsGrid = ({ data }: { data: IProject[] }) => {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {data.map((item, index) => (
        <ProjectCard
          key={index}
          index={index}
          project={item}
          imageLoading="eager"
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
