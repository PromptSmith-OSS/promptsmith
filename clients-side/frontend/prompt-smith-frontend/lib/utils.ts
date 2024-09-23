import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";


dayjs.extend(relativeTime)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const IS_IN_DEVELOPMENT = process.env.NODE_ENV === 'development'


export const formatRelativeTime = (date: Date|string) => {
  return dayjs(date).fromNow()
}
