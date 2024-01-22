import { Box, Select, TextField, Text, Button } from "@radix-ui/themes";
import React, { useState, useRef, useEffect } from "react";
import { GymService } from "js-gym";
import ReactPaginate from "react-paginate";
import { set } from "date-fns";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { allDummyWorkouts } from "../mockdata/defaultworkouts";
import { WheelControls } from "../components/ReusableSlider";
import { Workout } from "../types/workoutTypes";
import axiosInstance from "../util/axiosInterceptor";
const serverAPI = "http://localhost:8080";
// Initial Values:
const initialCardioValues: CardioWorkout = {
  type: "cardio",
  name: "",
  duration: 0,
  distance: 0,
  infoLink: "",
  notes: "",
};

const initialStrengthValues: StrengthWorkout = {
  type: "strength",
  name: "",
  muscle: "",
  infoLink: "",
  notes: "",
};

const initialStretchValues: StretchWorkout = {
  type: "stretch",
  name: "",
  duration: 0,
  difficulty: "",
  infoLink: "",
  notes: "",
};

// Initial Strength workouts:
const gymService = new GymService();
const muscleGroups = gymService.getMuscleGroups();
console.log("muscleGroups are: ", muscleGroups);
console.log(
  "gymService.findByExercise are: ",
  gymService.findByExercise("squat")
);

const WorkoutDatabase = () => {
  const [exerciseList, setExerciseList] = useState<AlgoExercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchErrorText, setSearchErrorText] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [chosenExercise, setChosenExercise] = useState<AlgoExercise>();
  const [savedExercise, setSavedExercise] = useState<UserWorkout>();
  const [allSavedExercise, setAllSavedExercise] = useState<UserWorkout[]>([]);

  const [cardioForm, setCardioForm] =
    useState<CardioWorkout>(initialCardioValues);
  const [strengthForm, setStrengthForm] = useState<StrengthWorkout>(
    initialStrengthValues
  );
  const [stretchForm, setStretchForm] =
    useState<StretchWorkout>(initialStretchValues);

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const [workoutToEdit, setWorkoutToEdit] = useState<UserWorkout>();

  const [workoutType, setWorkoutType] = useState<string>("");

  const [filter, setFilter] = useState(""); // Filter by workout type
  const [searchQuery, setSearchQuery] = useState(""); // Search for workout name
  const [filteredWorkouts, setFilteredWorkouts] = useState<UserWorkout[]>([]);

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: false,
      mode: "free-snap",
      slides: {
        perView: 3,
        spacing: 10,
      },
      breakpoints: {
        "(max-width: 768px)": {
          slides: { perView: 1 },
        },
        "(max-width: 1024px)": {
          slides: { perView: 2 },
        },
      },
    },
    [WheelControls]
  );
  useEffect(() => {
    setFilteredWorkouts([]);

    const lowercasedQuery = searchQuery.toLowerCase();

    const filtered = allSavedExercise.filter((workout) => {
      const matchesSearch = workout.name
        .toLowerCase()
        .includes(lowercasedQuery);
      const matchesFilter = filter ? workout.type === filter : true;

      return matchesSearch && matchesFilter;
    });

    setFilteredWorkouts(filtered);
  }, [searchQuery, filter, allSavedExercise]);

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
    try {
      console.log("saving exercise via POST request... ", savedWorkout);
      postExerciseDetails(savedWorkout!);
      setAllSavedExercise([...allSavedExercise, savedWorkout] as UserWorkout[]);
      setCardioForm(initialCardioValues);
      setStrengthForm(initialStrengthValues);
      setStretchForm(initialStretchValues);
      setWorkoutType("");
      setSearchTerm("");
      setChosenExercise(undefined);
      setExerciseList([]);
    } catch (e) {
      console.log("POST failed: ", e);
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
  const updateDatabaseWorkout = (id) => {
    const workout = allSavedExercise.find((workout) => workout.id === id);

    setWorkoutToEdit(workout!);

    setIsUpdateModalVisible(true);
  };
  const onSaveUpdatedWorkout = (updatedWorkout: UserWorkout) => {
    console.log("onSaveUpdatedWorkout updatedWorkout is: ", updatedWorkout);
    updateExerciseDetails(updatedWorkout);

    // setAllSavedExercise((prevWorkouts) =>
    //   prevWorkouts.map((workout) =>
    //     workout.id === updatedWorkout.id ? updatedWorkout : workout
    //   )
    // );
    setIsUpdateModalVisible(false);
  };
  const deleteDatabaseWorkout = (exerciseDetailId: string) => {
    deleteExerciseDetails(exerciseDetailId);
    // const newWorkouts = allSavedExercise.filter((workout) => workout.id !== id);
    // setAllSavedExercise(newWorkouts);
  };
  const getExerciseDetails = () => {
    axiosInstance.get(`${serverAPI}/details/findAll`).then((response) => {
      console.log("GET getExerciseDetails res: ", response.data);
      setAllSavedExercise(response.data);
    });
  };
  const postExerciseDetails = (newExercise: UserWorkout) => {
    axiosInstance
      .post(`${serverAPI}/details/`, {
        newExercise,
        exerciseType: newExercise.type,
      })
      .then((response) => {
        console.log("POST postExerciseDetails res: ", response.data);
        setAllSavedExercise(response.data);
      });
  };
  const updateExerciseDetails = (updatedExercise: UserWorkout) => {
    axiosInstance
      .put(`${serverAPI}/details/${updatedExercise.id}`, updatedExercise)
      .then((response) => {
        console.log("PUT updateExerciseDetails res: ", response.data);
        setAllSavedExercise(response.data);
      });
  };
  const deleteExerciseDetails = (exerciseId: string) => {
    axiosInstance
      .delete(`${serverAPI}/details/${exerciseId}`)
      .then((response) => {
        console.log("DELETE updateExerciseDetails res: ", response.data);
        setAllSavedExercise(response.data);
      });
  };
  useEffect(() => {
    getExerciseDetails();
  }, []);

  function handleExerciseClick(exercise: AlgoExercise): void {
    console.log("exercise is: ", exercise);
    setChosenExercise(exercise);
    setStrengthForm({
      type: "strength",
      id: exercise.id,
      name: exercise.name,
      muscle: exercise.muscle,
      infoLink: exercise.infoLink,
      notes: "",
    });
  }
  const squats = gymService.findByExercise("squats");
  gymService.findByExercise("squat");
  console.log("Squars rare: ", squats);
  const handleSearch = () => {
    // const results = gymService.findByExercise(JSON.stringify(value));
    console.log("gym searchTerm are: ", searchTerm);
    const results2 = gymService.findByExercise(searchTerm);
    if (results2.length == 0) {
      setSearchErrorText("Please submit a valid name");
    } else {
      setSearchErrorText(null);
    }
    // console.log("gym results are: ", results2);
    // console.log("gym results test2 are: ", gymService.findByExercise("squats"));
    // const squats = gymService.findByExercise("squat");
    console.log("gym results test2 are: ", squats);
    setExerciseList(results2);

    // setCurrentPage(1);
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

  function clearFilters(
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    setFilter("");
    setSearchQuery("");
  }

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
                    <Text as="label">Search by muscle type</Text>
                    <Select.Root
                      size="3"
                      // value={selectedWorkoutType ?? ""}
                      onValueChange={(value) => {
                        const values = gymService.getByMuscleGroup(value);
                        console.log(
                          "Search by muscle type: ",
                          typeof values.exercises,
                          values
                        );
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
                      <Text as="label">Search by exercise name</Text>
                      <TextField.Input
                        placeholder="Search for an exercise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTermHelper(e.target.value)}
                      />
                      <Box className="flex flex-col w-1/2 mt-2">
                        <Text className="text-red-600 text-sm">
                          {searchErrorText}
                        </Text>

                        <Button type="button" onClick={handleSearch}>
                          Search
                        </Button>
                      </Box>
                    </div>
                  </Box>
                  <label className="block">
                    <span className="text-gray-700">Name</span>
                    <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter exercise name"
                      value={chosenExercise?.name ?? ""}
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">Muscle Group</span>
                    <input
                      type="text"
                      className="form-input mt-1 block w-full"
                      placeholder="Enter muscle group"
                      value={chosenExercise?.muscle ?? ""}
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
                      value={chosenExercise?.infoLink ?? ""}
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
              <Box className="space-x-4">
                <Button type="submit" color="green" variant="solid">
                  Submit
                </Button>
                <Button
                  onClick={() => setWorkoutType("")}
                  color="tomato"
                  variant="soft"
                >
                  Cancel
                </Button>
              </Box>
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
      <div>
        <div className="flex space-x-3 mt-10">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2"
          >
            <option value="">All Workouts</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="stretch">Stretch</option>
          </select>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
        <div
          ref={sliderRef}
          className="keen-slider"
          key={filteredWorkouts.length}
        >
          {filteredWorkouts.map((workout, index) => (
            <div key={index} className="keen-slider__slide p-4">
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onUpdate={updateDatabaseWorkout}
                onDelete={deleteDatabaseWorkout}
              />
            </div>
          ))}
        </div>
      </div>
      {isUpdateModalVisible && (
        <WorkoutUpdateModal
          workout={workoutToEdit}
          onSaveUpdatedWorkout={(updatedWorkout) => {
            onSaveUpdatedWorkout(updatedWorkout);
          }}
          onCancel={() => setIsUpdateModalVisible(false)}
        />
      )}
    </div>
  );
};
type WorkoutProps = {
  workout: UserWorkout;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
};
const WorkoutCard: React.FC<WorkoutProps> = ({
  workout,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="border rounded-md p-4 m-2 min-w-[200px] shadow">
      <h3 className="font-bold text-lg mb-2">{workout.name}</h3>
      {"type" in workout && (
        <p>
          Type:{" "}
          {workout.type &&
            workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
        </p>
      )}

      {"muscle" in workout && <p>Muscle Group: {workout.muscle}</p>}
      {"duration" in workout && <p>Duration: {workout.duration} mins</p>}
      {"distance" in workout && <p>Distance: {workout.distance} km</p>}
      {"intensity" in workout && <p>Intensity: {workout.intensity}</p>}
      {"difficulty" in workout && <p>Difficulty: {workout.difficulty}</p>}
      <a
        href={workout.infoLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        More Info
      </a>
      {workout.notes && (
        <p className="mt-2 text-sm text-gray-600">Notes: {workout.notes}</p>
      )}
      <div className="space-x-3 mt-3">
        <Button onClick={() => onUpdate(workout.id)}>Update</Button>
        <Button onClick={() => onDelete(workout.id)}>Delete</Button>
      </div>
    </div>
  );
};

const WorkoutUpdateModal = ({ workout, onSaveUpdatedWorkout, onCancel }) => {
  const [formState, setFormState] = useState(workout);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("formState is: ", formState);
    onSaveUpdatedWorkout(formState);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Update Workout
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-600">Name:</label>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {"muscle" in workout && (
            <div>
              <label className="text-gray-600">Muscle Group:</label>
              <input
                type="text"
                name="muscle"
                value={formState.muscle}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {"duration" in workout && (
            <div>
              <label className="text-gray-600">Duration (minutes):</label>
              <input
                type="number"
                name="duration"
                value={formState.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {"intensity" in workout && (
            <div>
              <label className="text-gray-600">Intensity:</label>
              <select
                name="intensity"
                value={formState.intensity}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          )}

          {"difficulty" in workout && (
            <div>
              <label className="text-gray-600">Difficulty:</label>
              <select
                name="difficulty"
                value={formState.difficulty}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-gray-600">Info Link:</label>
            <input
              type="text"
              name="infoLink"
              value={formState.infoLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-gray-600">Notes:</label>
            <textarea
              name="notes"
              value={formState.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutDatabase;
