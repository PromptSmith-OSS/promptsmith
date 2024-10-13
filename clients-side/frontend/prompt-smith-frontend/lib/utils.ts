import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {IS_IN_DEVELOPMENT} from "@/lib/constants";


dayjs.extend(relativeTime)


/**
 * Used by shadcn
 * Do not remove
 * @param inputs
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function disableConsoleLogWhenNotInDevelopment() {
  if (!IS_IN_DEVELOPMENT) {
    console.log = function () {
    };
  }
}


export const formatRelativeTime = (date: Date | string) => {
  return dayjs(date).fromNow()
}
