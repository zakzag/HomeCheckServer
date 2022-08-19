
const SEC = 1000;
const MIN = SEC * 60;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

enum TIME {
    _1_MS = 1,
    _2_MS = 2,
    _3_MS = 3,
    _4_MS = 4,
    _5_MS = 5,
    _6_MS = 6,
    _7_MS = 7,
    _8_MS = 8,
    _9_MS = 9,
    _10_MS = 10,
    _100_MS = 100,

    _1_SEC = SEC,
    _2_SEC = 2 * SEC,
    _3_SEC = 3 * SEC,
    _4_SEC = 4 * SEC,
    _5_SEC = 5 * SEC,
    _6_SEC = 6 * SEC,
    _7_SEC = 7 * SEC,
    _8_SEC = 8 * SEC,
    _9_SEC = 9 * SEC,
    _10_SEC = 10 * SEC,
    _30_SEC = 30 * SEC,

    _1_MIN = MIN,
    _2_MIN = 2 * MIN,
    _3_MIN = 3 * MIN,
    _4_MIN = 4 * MIN,
    _5_MIN = 5 * MIN,
    _6_MIN = 6 * MIN,
    _7_MIN = 7 * MIN,
    _8_MIN = 8 * MIN,
    _9_MIN = 9 * MIN,
    _10_MIN = 10 * MIN,
    _30_MIN = 30 * MIN,

    _1_HOUR = HOUR,
    _2_HOUR = 2 * HOUR,
    _3_HOUR = 3 * HOUR,
    _4_HOUR = 4 * HOUR,
    _5_HOUR = 5 * HOUR,
    _6_HOUR = 6 * HOUR,
    _7_HOUR = 7 * HOUR,
    _8_HOUR = 8 * HOUR,
    _9_HOUR = 9 * HOUR,
    _10_HOUR = 10 * HOUR,
    _11_HOUR = 11 * HOUR,
    _12_HOUR = 12 * HOUR,

    _1_DAY = DAY,
    _2_DAY = 2 * DAY,
    _3_DAY = 3 * DAY,
    _4_DAY = 4 * DAY,
    _5_DAY = 5 * DAY,
    _6_DAY = 6 * DAY,

    _1_WEEK = WEEK,
    _2_WEEK = 2 * WEEK,
    _3_WEEK = 3 * WEEK,
    _4_WEEK = 4 * WEEK
}

export {
    SEC,
    MIN,
    HOUR,
    DAY,
    WEEK,
    TIME
}