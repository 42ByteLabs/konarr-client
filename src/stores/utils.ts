import { useNotification } from "@kyvg/vue3-notification";
import { router } from "@/router";

const { notify }  = useNotification();

export function handleErrors(error: any): boolean {
    if (error.code === "ERR_NETWORK") {
        notify({
            type: "error",
            text: "Network error has occured, please check server settings."
        });
    } else if (error.response) {
        if (error.response.status === 401) {
            if (router.currentRoute.value.name !== "Login") {
                router.push({ name: "Login" });
            } else {
                notify({
                    type: "error",
                    group: "auth",
                    text: "Authentication error has occured, please login again."
                });
            }
            return true;
        }
    } else {
        console.error("Unknown error occured", error);
    }

    return false;
}

