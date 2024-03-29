import {
  Box,
  Select,
  TextField,
  Text,
  TextArea,
  Button,
  Card,
  Heading,
  Link,
} from "@radix-ui/themes";
import React, { useState, useRef, useEffect } from "react";
import { GymService } from "js-gym";
import ReactPaginate from "react-paginate";
import { set } from "date-fns";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { allDummyWorkouts } from "../mockdata/defaultworkouts";
import { WheelControls } from "../components/ReusableSlider";
import { Workout } from "../types/workoutTypes";
import toast, { Toaster } from "react-hot-toast";
import {
  showRegularDeleteToast,
  showSuccessToast,
  showUpdateConfirmationToast,
  DeleteToastRegular,
} from "../components/ToastComponents";
import {
  FaceIcon,
  ImageIcon,
  MagnifyingGlassIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import axiosInstance from "../util/axiosInterceptor";
import {
  WorkoutProps,
  CardioWorkout,
  StrengthWorkout,
  StretchWorkout,
  UserWorkout,
  CardioDatabaseFormProps,
  StrengthDatabaseFormProps,
  StretchDatabaseFormProps,
  StrengthExerciseSearchResultsProps,
  SearchViewUpdateExerciseDatabaseProps,
  WorkoutUpdateModalProps,
} from "../types/workoutDatabaseTypes";

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
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [searchErrorText, setSearchErrorText] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [chosenExercise, setChosenExercise] = useState<AlgoExercise>();
  const [savedExercise, setSavedExercise] = useState<UserWorkout>();
  const [allSavedExercise, setAllSavedExercise] = useState<UserWorkout[]>([]);
  const [exerciseListFlag, setExerciseListFlag] = useState<boolean>(false);

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
  useEffect(() => {
    getExerciseDetails();
  }, []);
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
      // setAllSavedExercise([savedWorkout, ...allSavedExercise] as UserWorkout[]);
      setCardioForm(initialCardioValues);
      setStrengthForm(initialStrengthValues);
      setStretchForm(initialStretchValues);
      setWorkoutType("");
      setSearchTerm("");
      setFilter("");
      setChosenExercise(undefined);
      const resetExerciseList = exerciseList!.slice(
        indexOfFirstExercise,
        indexOfLastExercise
      );
      setExerciseList(resetExerciseList);
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
        const reversedData = response.data.slice().reverse();
        setAllSavedExercise(reversedData);
        setIsAddFormVisible(false);
        const toastMessage = "Database Exercise Has Been Added!";
        showSuccessToast(toastMessage);
      });
  };
  const updateExerciseDetails = (updatedExercise: UserWorkout) => {
    axiosInstance
      .put(`${serverAPI}/details/${updatedExercise.id}`, updatedExercise)
      .then((response) => {
        console.log("PUT updateExerciseDetails res: ", response.data);
        setAllSavedExercise(response.data);

        const toastMessage = "Database Exercise Has Been Updated!";
        showSuccessToast(toastMessage);
      });
  };
  const deleteExerciseDetails = (exerciseId: string) => {
    axiosInstance
      .delete(`${serverAPI}/details/${exerciseId}`)
      .then((response) => {
        console.log("DELETE updateExerciseDetails res: ", response.data);
        setAllSavedExercise(response.data);

        const toastMessage = "Database Exercise Has Been Deleted.";
        showRegularDeleteToast(toastMessage, null);
      });
  };
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

  const handleFormClose = () => {
    setWorkoutType("");
    setExerciseList([]);
    setSearchTerm("");
    setIsAddFormVisible(false);
  };

  function clearFilters(
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    setFilter("");
    setSearchQuery("");
  }

  return (
    <Box>
      {" "}
      <Box className="text-4xl font-bold text-center mb-6">
        Workout Database
      </Box>
      <Button onClick={() => setIsAddFormVisible(true)}>
        Add Exercise to Database
      </Button>
      <Box>
        <SearchViewUpdateExerciseDatabase
          setSearchQuery={setSearchQuery}
          setFilter={setFilter}
          clearFilters={clearFilters}
          sliderRef={sliderRef}
          filteredWorkouts={filteredWorkouts}
          searchQuery={searchQuery}
          filter={filter}
          updateDatabaseWorkout={updateDatabaseWorkout}
          deleteDatabaseWorkout={deleteDatabaseWorkout}
        />
      </Box>
      {/* <Box className="w-full flex justify-center items-center px-4 mt-5">
        <Box className="space-y-7 px-4 items-center flex flex-col md:flex-row md:items-center md:space-x-7">
          <Box className="flex flex-col  space-y-8 md: flex md:flex-row md:space-x-8">
            <Card size="3" className="min-h-[50px] min-w-[100px]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Box className="flex justify-center">
                  <Select.Root
                    size="3"
                    // value={workoutType}
                    onValueChange={(value) => {
                      console.log("The value is: ", value);
                      if (value !== "strength") {
                        setExerciseListFlag(false);
                      } else {
                        setExerciseListFlag(true);
                        const values = gymService.getByMuscleGroup("Chest");
                        setExerciseList(values.exercises);
                      }
                      setSearchTerm("");
                      setWorkoutType(value);
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
                        <Select.Label>Select a type</Select.Label>
                        <Select.Item value="cardio">Cardio</Select.Item>
                        <Select.Item value="strength">Strength</Select.Item>
                        <Select.Item value="stretch">Stretch</Select.Item>
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </Box>
                {workoutType === "cardio" && (
                  <CardioDatabaseForm
                    cardioForm={cardioForm}
                    setCardioForm={setCardioForm}
                  />
                )}

                {workoutType === "strength" && (
                  <StrengthDatabaseForm
                    strengthForm={strengthForm}
                    setStrengthForm={setStrengthForm}
                    setExerciseList={setExerciseList}
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                    chosenExercise={chosenExercise}
                  />
                )}

                {workoutType === "stretch" && (
                  <StretchDatabaseForm
                    stretchForm={stretchForm}
                    setStretchForm={setStretchForm}
                  />
                )}
                <Box className="space-x-4">
                  <Button type="submit" color="green" variant="solid">
                    Submit
                  </Button>
                  <Button
                    onClick={handleFormClose}
                    color="gray"
                    variant="surface"
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            </Card>
            {exerciseListFlag && (
              <Card
                size="3"
                className="shadow min-h-[100px] min-w-[300px] max-w-[600px] flex flex-col justify-center items-center"
              >
                {currentExercises.length === 0 ? (
                  <Text className="text-gray-600 text-lg">No Results</Text>
                ) : (
                  <StrengthExerciseSearchResults
                    handleExerciseClick={handleExerciseClick}
                    currentExercises={currentExercises}
                    exerciseList={exerciseList}
                    handlePageClick={handlePageClick}
                    exercisesPerPage={exercisesPerPage}
                  />
                )}
              </Card>
            )}
          </Box>
        </Box>
      </Box> */}
      {isUpdateModalVisible && (
        <WorkoutUpdateModal
          workout={workoutToEdit}
          onSaveUpdatedWorkout={(updatedWorkout) => {
            onSaveUpdatedWorkout(updatedWorkout);
          }}
          onCancel={() => setIsUpdateModalVisible(false)}
        />
      )}
      {isAddFormVisible && (
        <ExerciseFormModal
          handleSubmit={handleSubmit}
          setExerciseListFlag={setExerciseListFlag}
          setExerciseList={setExerciseList}
          setSearchTerm={setSearchTerm}
          setWorkoutType={setWorkoutType}
          workoutType={workoutType}
          cardioForm={cardioForm}
          setCardioForm={setCardioForm}
          strengthForm={strengthForm}
          setStrengthForm={setStrengthForm}
          searchTerm={searchTerm}
          chosenExercise={chosenExercise}
          stretchForm={stretchForm}
          setStretchForm={setStretchForm}
          handleFormClose={handleFormClose}
          exerciseListFlag={exerciseListFlag}
          currentExercises={currentExercises}
          handleExerciseClick={handleExerciseClick}
          exerciseList={exerciseList}
          handlePageClick={handlePageClick}
          exercisesPerPage={exercisesPerPage}
          onCancel={() => setIsAddFormVisible(false)}
        />
      )}
      <Toaster />
    </Box>
  );
};

const SearchViewUpdateExerciseDatabase: React.FC<
  SearchViewUpdateExerciseDatabaseProps
> = ({
  setSearchQuery,
  setFilter,
  clearFilters,
  sliderRef,
  filteredWorkouts,
  searchQuery,
  filter,
  updateDatabaseWorkout,
  deleteDatabaseWorkout,
}) => {
  return (
    <Card className="mt-4 flex space-x-3 mt-10 justify-center align-center shadow">
      <Box className="flex space-x-3 mt-10 justify-center align-center ">
        <TextField.Root>
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
          <TextField.Input
            size="3"
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </TextField.Root>

        <Select.Root
          size="3"
          // value={filter}
          onValueChange={(value) => setFilter(value)}
        >
          <Select.Trigger placeholder="Pick A Workout Type" variant="surface" />
          <Select.Content variant="solid" position="popper" sideOffset={2}>
            <Select.Group>
              <Select.Label>All Workouts</Select.Label>
              <Select.Item value="strength">Strength</Select.Item>
              <Select.Item value="cardio">Cardio</Select.Item>
              <Select.Item value="stretch">Stretch</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>

        <Button onClick={clearFilters}>Clear Filters</Button>
      </Box>
      <Box
        ref={sliderRef}
        className="keen-slider"
        key={filteredWorkouts.length}
      >
        {filteredWorkouts.map((workout, index) => (
          <Box key={index} className="keen-slider__slide p-4">
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onUpdate={updateDatabaseWorkout}
              onDelete={deleteDatabaseWorkout}
            />
          </Box>
        ))}
      </Box>
    </Card>
  );
};

const CardioDatabaseForm: React.FC<CardioDatabaseFormProps> = ({
  cardioForm,
  setCardioForm,
}) => {
  return (
    <>
      <Box>
        <Text as="label" size="3">
          Name
        </Text>
        <TextField.Input
          type="text"
          className="form-input mt-1 block w-full"
          placeholder="Enter exercise name"
          onChange={(e) =>
            setCardioForm({ ...cardioForm, name: e.target.value })
          }
        />
      </Box>

      <Box>
        <Text className="text-gray-700">Duration (minutes)</Text>
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
      </Box>

      <Box>
        <Text as="label" size="3">
          Distance (optional)
        </Text>
        <TextField.Input
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
      </Box>

      <Box className="space-x-3">
        <Text as="label" size="3">
          Intensity
        </Text>
        <Select.Root
          size="2"
          onValueChange={(value) =>
            setCardioForm({
              ...cardioForm,
              intensity: value,
            })
          }
        >
          <Select.Trigger placeholder="Intensity Level" variant="surface" />
          <Select.Content variant="solid" position="popper" sideOffset={2}>
            <Select.Group>
              <Select.Item value="low">Low</Select.Item>
              <Select.Item value="medium">Medium</Select.Item>
              <Select.Item value="high">High</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Box>

      <Box>
        <Text as="label" size="3">
          Info Link
        </Text>
        <TextField.Input
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
      </Box>

      <Box>
        <Text as="label" size="3">
          Notes
        </Text>
        <TextArea
          className="form-textarea mt-1 block w-full"
          rows={3}
          placeholder="Enter any notes"
          onChange={(e) =>
            setCardioForm({
              ...cardioForm,
              notes: e.target.value,
            })
          }
        ></TextArea>
      </Box>
    </>
  );
};
const StretchDatabaseForm: React.FC<StretchDatabaseFormProps> = ({
  stretchForm,
  setStretchForm,
}) => {
  return (
    <Box className="space-y-5">
      <Box>
        <Text as="label" size="3">
          Name
        </Text>
        <TextField.Input
          type="text"
          className="form-input mt-1 block w-full"
          placeholder="Enter stretch name"
          onChange={(e) =>
            setStretchForm({
              ...stretchForm,
              name: e.target.value,
            })
          }
        />
      </Box>

      <Box>
        <Text as="label" size="3">
          Duration
        </Text>
        <TextField.Input
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
      </Box>

      <Box className="space-x-3">
        <Text as="label" size="3">
          Difficulty
        </Text>
        <Select.Root
          onValueChange={(value) =>
            setStretchForm({
              ...stretchForm,
              difficulty: value,
            })
          }
        >
          <Select.Trigger placeholder="Pick A Workout Type" variant="surface" />
          <Select.Content variant="solid" position="popper" sideOffset={2}>
            <Select.Group>
              <Select.Label>Intesnity Level</Select.Label>
              <Select.Item value="easy">Easy</Select.Item>
              <Select.Item value="medium">Medium</Select.Item>
              <Select.Item value="hard">Hard</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Box>

      <Box>
        <Text as="label" size="3">
          Info Link
        </Text>
        <TextField.Input
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
      </Box>

      <Box>
        <Text as="label" size="3">
          Notes
        </Text>
        <TextArea
          className="form-textarea mt-1 block w-full"
          rows={3}
          placeholder="Enter any notes"
          onChange={(e) =>
            setStretchForm({
              ...stretchForm,
              notes: e.target.value,
            })
          }
        ></TextArea>
      </Box>
    </Box>
  );
};
const StrengthDatabaseForm: React.FC<StrengthDatabaseFormProps> = ({
  strengthForm,
  setStrengthForm,
  setExerciseList,
  setSearchTerm,
  searchTerm,
  chosenExercise,
}) => {
  return (
    <Box className="space-y-5">
      <Box className="text-xl font-medium space-y-3">
        <Box>
          <Text as="label" size="3">
            Search by muscle type
          </Text>
          <Box>
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
              <Select.Content variant="solid" position="popper" sideOffset={2}>
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
          </Box>
        </Box>
        <Box>
          <Box>
            <Text as="label" size="3">
              Search by exercise name
            </Text>
            <TextField.Input
              placeholder="Search for an exercise..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                const values = gymService.findByExercise(e.target.value);
                setExerciseList(values);
              }}
              // onChange={(e) => setSearchTermHelper(e.target.value)}
            />
          </Box>
        </Box>
      </Box>
      <Box>
        <Text as="label" size="3">
          Name
        </Text>
        <TextField.Input
          type="text"
          className="form-input mt-1 block w-full"
          placeholder="Enter exercise name"
          value={chosenExercise?.name ?? ""}
        />
      </Box>

      <Box>
        <Text as="label" size="3">
          Muscle Group
        </Text>
        <TextField.Input
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
      </Box>

      <Box>
        <Text as="label" size="3">
          Info Link
        </Text>
        <TextField.Input
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
      </Box>
      <Box>
        <Text as="label" size="3">
          Notes
        </Text>
        <TextArea
          className="form-TextArea mt-1 block w-full"
          rows={3}
          placeholder="Enter any notes"
          onChange={(e) =>
            setStrengthForm({
              ...strengthForm,
              notes: e.target.value,
            })
          }
        ></TextArea>
      </Box>
      <Toaster />
    </Box>
  );
};

const StrengthExerciseSearchResults: React.FC<
  StrengthExerciseSearchResultsProps
> = ({
  currentExercises,
  exerciseList,
  handleExerciseClick,
  handlePageClick,
  exercisesPerPage,
}) => {
  return (
    <Box>
      {currentExercises.map((exercise: any, index: number) => (
        <Box
          key={index}
          onClick={() => handleExerciseClick(exercise)}
          className="cursor-pointer p-4 border border-gray-200 rounded-md hover:bg-gray-100"
        >
          <Heading size="4" className="text-lg font-semibold">
            {exercise.name}
          </Heading>
          <Text as="p">Muscle Group: {exercise.muscle}</Text>
          <Link
            href={exercise.infoLink}
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
            color="blue"
          >
            Video & Info Link
          </Link>
        </Box>
      ))}
      {exerciseList && exerciseList.length > exercisesPerPage && (
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={Math.ceil(exerciseList.length / exercisesPerPage)}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center gap-4 my-4"}
          pageClassName={"border px-3 py-1 rounded hover:bg-gray-100"}
          activeClassName={"bg-blue-500 text-white"}
        />
      )}
    </Box>
  );
};

const WorkoutCard: React.FC<WorkoutProps> = ({
  workout,
  onUpdate,
  onDelete,
}) => {
  return (
    <Box className="border rounded-md p-4 m-2 min-w-[200px] shadow">
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
      <Box className="space-x-3 mt-3">
        <Button
          color="blue"
          variant="classic"
          onClick={() => onUpdate(workout.id)}
        >
          Update
        </Button>
        <Button
          color="tomato"
          variant="classic"
          onClick={() => onDelete(workout.id)}
        >
          Delete
        </Button>
      </Box>
    </Box>
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
    <Box className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <Box className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Update Workout
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Box>
            <label className="text-gray-600">Name:</label>
            <TextField.Input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </Box>

          {"muscle" in workout && (
            <Box>
              <label className="text-gray-600">Muscle Group:</label>
              <TextField.Input
                type="text"
                name="muscle"
                value={formState.muscle}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </Box>
          )}

          {"duration" in workout && (
            <Box>
              <label className="text-gray-600">Duration (minutes):</label>
              <TextField.Input
                type="number"
                name="duration"
                value={formState.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </Box>
          )}

          {"intensity" in workout && (
            <Box>
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
            </Box>
          )}

          {"difficulty" in workout && (
            <Box>
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
            </Box>
          )}

          <Box>
            <label className="text-gray-600">Info Link:</label>
            <TextField.Input
              type="text"
              name="infoLink"
              value={formState.infoLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </Box>

          <Box>
            <label className="text-gray-600">Notes:</label>
            <TextArea
              name="notes"
              value={formState.notes}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </Box>

          <Box className="flex justify-end pt-2 space-x-4">
            <Button color="gray" variant="surface" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" color="blue" variant="solid">
              Update
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

const ExerciseFormModal = ({
  handleSubmit,
  setExerciseListFlag,
  setExerciseList,
  setSearchTerm,
  setWorkoutType,
  workoutType,
  cardioForm,
  setCardioForm,
  strengthForm,
  setStrengthForm,
  searchTerm,
  chosenExercise,
  stretchForm,
  setStretchForm,
  handleFormClose,
  exerciseListFlag,
  currentExercises,
  handleExerciseClick,
  exerciseList,
  handlePageClick,
  exercisesPerPage,
  onCancel,
}) => {
  return (
    <Box className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <Box className="bg-white p-6 rounded-lg shadow-md">
        <Box className="">
          <Box className="space-y-7 px-4 items-center flex flex-col md:flex-row md:items-center md:space-x-7">
            <Box className="flex flex-col center-items align-items">
              <Heading as="h3" className="flex justify-center items-center">
                Add Exercise
              </Heading>
              <Box className="mt-7 flex flex-col  space-y-8 md: flex md:flex-row md:space-x-8">
                <Card size="3" className="min-h-[50px] min-w-[100px]">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Box className="flex justify-center">
                      <Select.Root
                        size="3"
                        // value={workoutType}
                        onValueChange={(value) => {
                          console.log("The value is: ", value);
                          if (value !== "strength") {
                            setExerciseListFlag(false);
                          } else {
                            setExerciseListFlag(true);
                            const values = gymService.getByMuscleGroup("Chest");
                            setExerciseList(values.exercises);
                          }
                          setSearchTerm("");
                          setWorkoutType(value);
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
                            <Select.Label>Select a type</Select.Label>
                            <Select.Item value="cardio">Cardio</Select.Item>
                            <Select.Item value="strength">Strength</Select.Item>
                            <Select.Item value="stretch">Stretch</Select.Item>
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    </Box>
                    {workoutType === "cardio" && (
                      <CardioDatabaseForm
                        cardioForm={cardioForm}
                        setCardioForm={setCardioForm}
                      />
                    )}

                    {workoutType === "strength" && (
                      <StrengthDatabaseForm
                        strengthForm={strengthForm}
                        setStrengthForm={setStrengthForm}
                        setExerciseList={setExerciseList}
                        setSearchTerm={setSearchTerm}
                        searchTerm={searchTerm}
                        chosenExercise={chosenExercise}
                      />
                    )}

                    {workoutType === "stretch" && (
                      <StretchDatabaseForm
                        stretchForm={stretchForm}
                        setStretchForm={setStretchForm}
                      />
                    )}
                    <Box className="space-x-4">
                      <Button type="submit" color="green" variant="solid">
                        Submit
                      </Button>
                      <Button
                        onClick={handleFormClose}
                        color="gray"
                        variant="surface"
                      >
                        Cancel
                      </Button>
                    </Box>
                  </form>
                </Card>
                {exerciseListFlag && (
                  <Card
                    size="3"
                    className="shadow min-h-[100px] min-w-[300px] max-w-[600px] flex flex-col justify-center items-center"
                  >
                    {currentExercises.length === 0 ? (
                      <Text className="text-gray-600 text-lg">No Results</Text>
                    ) : (
                      <StrengthExerciseSearchResults
                        handleExerciseClick={handleExerciseClick}
                        currentExercises={currentExercises}
                        exerciseList={exerciseList}
                        handlePageClick={handlePageClick}
                        exercisesPerPage={exercisesPerPage}
                      />
                    )}
                  </Card>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default WorkoutDatabase;
