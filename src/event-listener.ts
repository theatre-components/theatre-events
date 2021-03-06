/**
 * This is the shape of an event listener function
 */
interface EventListener
{
    /**
     * A priority is used to specified a launch priority. The lowest is the
     * the priority the soonest it will be launched.
     */
    priority?: number;

    /**
     * This function is attached to a dispatcher or broadcaster to handle
     * a triggered event payload.
     */
    <T>(payload?: T): any|Promise<any>;

    <T, R>(payload?: T): R|Promise<R>;
}

/**
 * A standard LOW priority constant
 */
export const LOW_PRIORITY = 255;

/**
 * A standard NORMAL priority constant
 */
export const NORMAL_PRIORITY = 0;

/**
 * A standard HIGH priority constant
 */
export const HIGH_PRIORITY = -255;

export default EventListener;
