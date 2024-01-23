import { toast } from "react-hot-toast";

export const DeleteToast = ({ savedDeletedItem, onUndo }) => (
  <div className="bg-orange-500 text-white text-sm p-3 rounded-lg shadow-lg flex justify-between items-center">
    <span>Item deleted.</span>
    <button
      onClick={() => onUndo(savedDeletedItem)}
      className="bg-white text-red-500 text-xs px-2 py-1 rounded ml-4 hover:bg-gray-100"
    >
      Undo
    </button>
  </div>
);

export const SuccessToast = ({ message }) => (
  <div className="bg-lime-500 text-white text-sm p-3 rounded-lg shadow-lg flex justify-between items-center">
    <span>{message}</span>
    <button
      onClick={() => toast.dismiss()}
      className="bg-white text-green-500 text-xs px-2 py-1 rounded ml-4 hover:bg-gray-100"
    >
      Close
    </button>
  </div>
);

export const UpdateConfirmationToast = ({ onUpdate }) => (
  <div className="bg-cyan-500 text-white text-sm p-3 rounded-lg shadow-lg flex justify-between items-center">
    <span>Are you sure you want to update?</span>
    <button
      onClick={onUpdate}
      className="bg-white text-blue-500 text-xs px-2 py-1 rounded ml-4 hover:bg-gray-100"
    >
      Update
    </button>
  </div>
);

// Utility functions to show toasts
export const showDeleteToast = (savedDeletedItem, undoFunction) => {
  toast.custom(
    <DeleteToast
      savedDeletedItem={savedDeletedItem}
      onUndo={() => undoFunction(savedDeletedItem)}
    />,
    {
      duration: 3000,
      position: "bottom-right",
    }
  );
};

export const showSuccessToast = (message) => {
  toast.custom(<SuccessToast message={message} />, {
    position: "bottom-right",
    duration: 3000,
  });
};

export const showUpdateConfirmationToast = (updateFunction) => {
  toast.custom(<UpdateConfirmationToast onUpdate={updateFunction} />, {
    position: "bottom-right",
    duration: 3000,
  });
};
