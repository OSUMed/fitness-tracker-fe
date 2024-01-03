import { Box, Select, TextField, Text } from "@radix-ui/themes";
import React, { useState } from "react";
import { GymService } from "js-gym";
import ReactPaginate from "react-paginate";
import { set } from "date-fns";
import axios from "axios";
const gymService = new GymService();
const muscleGroups = gymService.getMuscleGroups();
console.log("muscleGroups are: ", muscleGroups);

type AlgoExercise = {
  name: string;
  muscle: string;
  infoLink: string;
};

type StrengthWorkout = {
  name: string;
  muscle: string;
  infoLink: string;
  notes: string;
};

type CardioWorkout = {
  name: string;
  duration: number;
  distance?: number;
  intensity: string;
  infoLink: string;
  notes: string;
  instructions: string;
  muscle: string;
  difficulty: string;
  type: string;
};

type APINinjaCardioWorkout = {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
};

type StretchWorkout = {
  name: string;
  duration: number;
  difficulty: string;
  infoLink: string;
  notes: string;
};
type UserWorkout = StrengthWorkout | CardioWorkout | StretchWorkout;
const initialCardioValues: CardioWorkout = {
  name: "",
  duration: 0,
  distance: 0,
  intensity: "",
  infoLink: "",
  notes: "",
  instructions: "",
  muscle: "",
  difficulty: "",
  type: "",
};

const initialStrengthValues: StrengthWorkout = {
  name: "",
  muscle: "",
  infoLink: "",
  notes: "",
};

const initialStretchValues: StretchWorkout = {
  name: "",
  duration: 0,
  difficulty: "",
  infoLink: "",
  notes: "",
};
const WorkoutDatabaseCardio = () => {
  const [exerciseList, setExerciseList] = useState<AlgoExercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cardioOffset, setCardioOffset] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [chosenAlgoExercise, setChosenAlgoExercise] = useState<AlgoExercise>();
  const [chosenCardioExercise, setchosenCardioExercise] =
    useState<AlgoExercise>();
  const [savedExercise, setSavedExercise] = useState<UserWorkout>();
  const [allSavedExercise, setAllSavedExercise] = useState<UserWorkout[]>([]);

  const [cardioForm, setCardioForm] =
    useState<CardioWorkout>(initialCardioValues);
  const [strengthForm, setStrengthForm] = useState<StrengthWorkout>(
    initialStrengthValues
  );
  const [stretchForm, setStretchForm] =
    useState<StretchWorkout>(initialStretchValues);

  const [workoutType, setWorkoutType] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    let savedWorkout;
    if (workoutType === "cardio") {
      savedWorkout = { ...cardioForm };
    } else if (workoutType === "strength") {
      savedWorkout = { ...strengthForm };
    } else if (workoutType === "stretch") {
      savedWorkout = { ...stretchForm };
    }

    console.log("Saved Workout:", savedWorkout);
    setAllSavedExercise([...allSavedExercise, savedWorkout] as UserWorkout[]);
    setCardioForm(initialCardioValues);
    setStrengthForm(initialStrengthValues);
    setStretchForm(initialStretchValues);
    setWorkoutType("");
    setChosenAlgoExercise(undefined);
    setExerciseList([]);
  };

  const getCardioExercises = async () => {
    const options = {
      method: "GET",
      url: "https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises",
      params: {
        type: "cardio",
        offset: cardioOffset,
      },
      headers: {
        "X-RapidAPI-Key": "5ec5743921msh5aaf6b0fac82a8ap156f51jsnf2dfa4726962",
        "X-RapidAPI-Host": "exercises-by-api-ninjas.p.rapidapi.com",
      },
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const exercisesPerPage = 5;

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  let currentExercises = exerciseList!.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  function handleExerciseClick(exercise: AlgoExercise): void {
    console.log("exercise is: ", exercise);
    setChosenAlgoExercise(exercise);
    setStrengthForm({
      name: exercise.name,
      muscle: exercise.muscle,
      infoLink: exercise.infoLink,
      notes: "",
    });
  }
  function handleCardioClick(exercise: APINinjaCardioWorkout): void {
    console.log("exercise is: ", exercise);
    setChosenAlgoExercise(exercise);
    setCardioForm({});
  }
  const handleSearch = () => {
    const results = gymService.findByExercise(searchTerm);
    setExerciseList(results);
    setCurrentPage(1);
  };

  const setSearchTermHelper = (term: string) => {
    if (term === "") {
      setExerciseList([]);
      setSearchTerm("");
      currentExercises = [];
      return;
    }
    setSearchTerm(term);
  };

  return (
    <div>
      {" "}
      <Box className="text-4xl font-bold text-center mb-6">
        Workout Database
      </Box>
      <div className="w-full flex justify-center items-center px-4">
        <Box className="space-y-7 px-4 items-center flex flex-col md:flex-row md:items-center md:space-x-7">
          <Box className="flex space-x-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block">
                <span className="text-gray-700">Workout Type</span>
                <select
                  className="form-select block w-full mt-1"
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                >
                  <option value="">Select a type</option>
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="stretch">Stretch</option>
                </select>
              </label>
              {workoutType === "cardio" && (
                <>
                  <label className="block">
                    <span className="text-gray-700">Name</span>
                    <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter exercise name"
                      onChange={(e) =>
                        setCardioForm({ ...cardioForm, name: e.target.value })
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Duration (minutes)</span>
                    <input
                      type="string"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter duration in minutes"
                      onChange={(e) =>
                        setCardioForm({
                          ...cardioForm,
                          duration: parseInt(e.target.value),
                        })
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Distance (optional)</span>
                    <input
                      type="number"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter distance (km or miles)"
                      onChange={(e) =>
                        setCardioForm({
                          ...cardioForm,
                          distance: parseInt(e.target.value),
                        })
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Intensity</span>
                    <select
                      className="form-select block w-full mt-1"
                      onChange={(e) =>
                        setCardioForm({
                          ...cardioForm,
                          intensity: e.target.value,
                        })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Info Link</span>
                    <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter URL to info"
                      onChange={(e) =>
                        setCardioForm({
                          ...cardioForm,
                          infoLink: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Notes</span>
                    <textarea
                      className="form-textarea mt-1 block w-full"
                      rows={3}
                      placeholder="Enter any notes"
                      onChange={(e) =>
                        setCardioForm({ ...cardioForm, notes: e.target.value })
                      }
                    ></textarea>
                  </label>
                </>
              )}

              {workoutType === "strength" && (
                <>
                  <Box className="text-xl font-medium">
                    <div>
                      <Text as="label">Search by muscle type</Text>
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
                    </div>
                    <div>
                      <Text as="label">Search by exercise name</Text>
                      <TextField.Input
                        placeholder="Search for an exercise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTermHelper(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <button onClick={handleSearch}>Search</button>
                    </div>
                  </Box>
                  <label className="block">
                    <span className="text-gray-700">Name</span>
                    <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter exercise name"
                      value={chosenAlgoExercise?.name ?? ""}
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Muscle Group</span>
                    <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter muscle group"
                      value={chosenAlgoExercise?.muscle ?? ""}
                      onChange={(e) =>
                        setStrengthForm({
                          ...strengthForm,
                          muscle: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Info Link</span>
                    <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter URL to info"
                      value={chosenAlgoExercise?.infoLink ?? ""}
                      onChange={(e) =>
                        setStrengthForm({
                          ...strengthForm,
                          infoLink: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Notes</span>
                    <textarea
                      className="form-textarea mt-1 block w-full"
                      rows={3}
                      placeholder="Enter any notes"
                      onChange={(e) =>
                        setStrengthForm({
                          ...strengthForm,
                          notes: e.target.value,
                        })
                      }
                    ></textarea>
                  </label>
                </>
              )}

              {workoutType === "stretch" && (
                <>
                  <label className="block">
                    <span className="text-gray-700">Name</span>
                    <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter stretch name"
                      onChange={(e) =>
                        setStretchForm({ ...stretchForm, name: e.target.value })
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Duration</span>
                    <input
                      type="number"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter duration in minutes"
                      onChange={(e) =>
                        setStretchForm({
                          ...stretchForm,
                          duration: parseInt(e.target.value),
                        })
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Difficulty</span>
                    <select
                      className="form-select block w-full mt-1"
                      onChange={(e) =>
                        setStretchForm({
                          ...stretchForm,
                          difficulty: e.target.value,
                        })
                      }
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Info Link</span>
                    <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter URL to info"
                      onChange={(e) =>
                        setStretchForm({
                          ...stretchForm,
                          infoLink: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Notes</span>
                    <textarea
                      className="form-textarea mt-1 block w-full"
                      rows={3}
                      placeholder="Enter any notes"
                      onChange={(e) =>
                        setStretchForm({
                          ...stretchForm,
                          notes: e.target.value,
                        })
                      }
                    ></textarea>
                  </label>
                </>
              )}

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </form>
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
                    pageClassName={"border px-3 py-1 rounded hover:bg-gray-100"}
                    activeClassName={"bg-blue-500 text-white"}
                  />
                )}
              </div>
            )}
          </Box>
        </Box>
      </div>
      <div className="mt-6 text-center">
        allSavedExercise: {JSON.stringify(allSavedExercise)}
      </div>
    </div>
  );
};

export default WorkoutDatabaseCardio;
