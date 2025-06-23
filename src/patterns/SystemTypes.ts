/**
 * A method that calls every game tick.
 */
export type UpdateFunction = (deltaTime: number) => void;

/**
 * A method that calls every frame.
 */
export type DrawFunction = () => void;