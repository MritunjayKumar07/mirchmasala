import { FaArrowLeftLong } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { ApiErrorResponse } from "./ApiErrorResponse.js";
import { useNavigate } from "react-router-dom";

function ApiError() {
  const navigate = useNavigate();
  const { code } = useParams();

  // Find the error object with the matching status code
  const error = ApiErrorResponse.find(
    (error) => error.statuscode === parseInt(code)
  );

  return (
    <div className="py-10 flex justify-center">
      <div className="text-center">
        <p className="text-base font-semibold text-black">{code}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-5xl">
          {error ? error.message : "Page not found"}{" "}
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          {error
            ? error.description
            : "Sorry, we couldn't find the page you're looking for."}{" "}
        </p>
        <div className="mt-4 flex items-center justify-center gap-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <FaArrowLeftLong size={16} className="mr-2" />
            Go back
          </button>
          <button
            type="button"
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiError;
