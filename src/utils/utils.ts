import { BadRequestException } from '@nestjs/common';

/**
 * The function `validateTimeFormat` checks if a given time string is in the format mm:ss.
 * @param {string} time - The `time` parameter is a string representing a time value in the format of
 * mm:ss (minutes:seconds).
 */
export const validateTimeFormat = (time: string): void => {
  const regex = /^([0-5]?[0-9]):([0-5][0-9])$/;
  const match = time.match(regex);

  if (!match) {
    throw new BadRequestException('Time must be in mm:ss format');
  }
};

/**
 * The function `timeToSeconds` converts a time string in the format "mm:ss" to the total number of
 * seconds.
 * @param {string} time - A string representing a time in the format "mm:ss", where "mm" is the minutes
 * and "ss" is the seconds.
 * @returns The function `timeToSeconds` returns the total number of seconds calculated from the input
 * time string in the format "minutes:seconds".
 */
export const timeToSeconds = (time: string): number => {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
};

/**
 * The `secondsToTime` function in TypeScript converts a given number of seconds into a formatted time
 * string in the format "mm:ss".
 * @param {number} seconds - The `secondsToTime` function takes a number of seconds as input and
 * converts it into a formatted time string in the format "mm:ss".
 * @returns The function `secondsToTime` returns a formatted time string in the format "mm:ss" where
 * "mm" represents the minutes and "ss" represents the remaining seconds after converting the total
 * seconds input.
 */
export const secondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  return formattedTime;
};
