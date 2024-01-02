import { Box, Select, TextField } from "@radix-ui/themes";
import React, { useState } from "react";
import { GymService } from "js-gym";
import ReactPaginate from "react-paginate";
const gymService = new GymService();
const muscleGroups = gymService.getMuscleGroups();
console.log("muscleGroups are: ", muscleGroups);

type AlgoExercise = {
  name: string;
  muscle: string;
  infoLink: string;
};

const WorkoutDatabase = () => {
  const [exerciseList, setExerciseList] = React.useState<AlgoExercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = React.useState(1);

  const exercisesPerPage = 5;

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exerciseList!.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  function handleExerciseClick(exercise: AlgoExercise): void {
    console.log("exercise is: ", exercise);
  }
  const handleSearch = () => {
    const results = gymService.findByExercise(searchTerm);
    setExerciseList(results);
    setCurrentPage(1);
  };

  return (
    <div>
      {" "}
      <div className="w-full flex justify-center items-center px-4">
        <Box className="space-y-7 px-4 items-center flex flex-col md:flex-row md:items-center md:space-x-7">
          <Box className="space-y-4">
            <Box className="text-4xl font-bold">Workout Database</Box>
            <Box className="text-xl font-medium">
              Search for workouts and add them to your week planner
              <Select.Root
                size="3"
                // value={selectedWorkoutType ?? ""}
                onValueChange={(value) => {
                  const values = gymService.getByMuscleGroup(value);
                  console.log(typeof values, values.exercises);
                  setExerciseList(values.exercises);
                }}
              >
                <Select.Trigger
                  placeholder="Pick A Workout Type"
                  variant="surface"
                />
                <Select.Content
                  variant="solid"
                  position="popper"
                  sideOffset={2}
                >
                  <Select.Group>
                    <Select.Label>Workout Options</Select.Label>
                    {muscleGroups.map((group, index) => (
                      <Select.Item key={index} value={group}>
                        {group}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
              <div>
                <TextField.Input
                  placeholder="Search for an exercise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button onClick={handleSearch}>Search</button>
              </div>
              {currentExercises && (
                <div>
                  {currentExercises.map((exercise, index) => (
                    <div
                      key={index}
                      onClick={() => handleExerciseClick(exercise)}
                      className="cursor-pointer p-4 border border-gray-200 rounded-md hover:bg-gray-100"
                    >
                      <h3 className="text-lg font-semibold">{exercise.name}</h3>
                      <p>Muscle Group: {exercise.muscle}</p>
                      <a
                        href={exercise.infoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Video & Info Link
                      </a>
                    </div>
                  ))}
                  {exerciseList && exerciseList.length > exercisesPerPage && (
                    <ReactPaginate
                      previousLabel={"previous"}
                      nextLabel={"next"}
                      breakLabel={"..."}
                      pageCount={Math.ceil(
                        exerciseList.length / exercisesPerPage
                      )}
                      onPageChange={handlePageClick}
                      containerClassName={"flex justify-center gap-4 my-4"}
                      pageClassName={
                        "border px-3 py-1 rounded hover:bg-gray-100"
                      }
                      activeClassName={"bg-blue-500 text-white"}
                    />
                  )}
                </div>
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default WorkoutDatabase;
