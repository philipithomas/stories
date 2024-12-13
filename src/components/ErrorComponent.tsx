export default function ErrorComponent({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Oops!</h1>
        <p className="text-red-500">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
