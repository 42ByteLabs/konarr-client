import { useNotification } from "@kyvg/vue3-notification";
import { router } from "@/router";
import type { ApiError } from "@/types";

const { notify } = useNotification();

/**
 * Type guard to check if a response is an ApiError
 *
 * @param response - The response to check
 * @returns true if the response is an ApiError
 */
export function isApiError(response: any): response is ApiError {
  return (
    response &&
    typeof response === "object" &&
    "message" in response &&
    "status" in response
  );
}

/**
 * Handle API errors consistently across all stores
 * Extracts ApiError from response and displays appropriate notifications
 *
 * @param error - The error object from axios/API call
 * @returns true if error was handled (e.g., 401 redirect), false otherwise
 */
export function handleErrors(error: any): boolean {
  if (error.code === "ERR_NETWORK") {
    notify({
      type: "error",
      text: "Network error has occured, please check server settings.",
    });
  } else if (error.response) {
    // Handle 401 Unauthorized - redirect to login
    if (error.response.status === 401) {
      if (router.currentRoute.value.name === "Home") {
        return true;
      } else if (router.currentRoute.value.name !== "Login") {
        router.push({ name: "Login" });
      } else {
        notify({
          type: "error",
          group: "auth",
          text: "Authentication error has occured, please login again.",
        });
      }
      return true;
    }

    // Extract ApiError from response if available
    const apiError: ApiError | undefined = error.response.data;
    if (apiError && apiError.message) {
      // Display the API error message with optional details
      const errorText = apiError.details
        ? `${apiError.message}: ${apiError.details}`
        : apiError.message;

      notify({
        type: "error",
        text: errorText,
      });
    } else {
      // Fallback for non-ApiError responses
      notify({
        type: "error",
        text: `API error (${error.response.status}): ${error.response.statusText || "Unknown error"}`,
      });
    }
  } else {
    console.error("Unknown error occured", error);
    notify({
      type: "error",
      text: "An unexpected error occurred. Please try again.",
    });
  }

  return false;
}

/**
 * Handle ApiResponse union type
 * If response is an error, display notification and return null
 * Otherwise return the data
 *
 * @param response - The API response (T | ApiError)
 * @returns The data if success, null if error
 */
export function handleApiResponse<T>(response: T | ApiError): T | null {
  if (isApiError(response)) {
    const errorText = response.details
      ? `${response.message}: ${response.details}`
      : response.message;

    // Handle 401 specifically
    if (response.status === 401) {
      if (router.currentRoute.value.name === "Home") {
        return null;
      } else if (router.currentRoute.value.name !== "Login") {
        router.push({ name: "Login" });
      } else {
        notify({
          type: "error",
          group: "auth",
          text: "Authentication error has occured, please login again.",
        });
      }
    } else {
      notify({
        type: "error",
        text: errorText,
      });
    }

    return null;
  }

  return response;
}
