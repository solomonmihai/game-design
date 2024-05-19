const levels = [
  {
    bounds: {
      x: 0,
      y: 0,
      width: 21,
      height: 12,
    },
    blocks: [
      {
        pos: {
          x: 0,
          y: 0,
        },
        width: 10,
        height: 3,
      },
      {
        pos: {
          x: 0,
          y: 7,
        },
        width: 6,
        height: 4,
      },
      {
        pos: {
          x: 14,
          y: 0,
        },
        width: 6,
        height: 3,
      },
      {
        pos: {
          x: 11,
          y: 7,
        },
        width: 9,
        height: 4,
      },
    ],
    agents: [
      {
        path: [
          {
            x: 12,
            y: 1,
          },
          {
            x: 8,
            y: 5,
          },
          {
            x: 9,
            y: 10,
          },
        ],
      },
    ],
    start: { x: 1, y: 5 },
    end: { x: 1, y: 5 },
    goal: { x: 19, y: 5 },
  },
  {
    bounds: {
      x: 0,
      y: 0,
      width: 33,
      height: 21,
    },
    blocks: [
      {
        pos: {
          x: 3,
          y: 0,
        },
        width: 5,
        height: 3,
      },
      {
        pos: {
          x: 0,
          y: 5,
        },
        width: 3,
        height: 5,
      },
      {
        pos: {
          x: 6,
          y: 5,
        },
        width: 5,
        height: 9,
      },
      {
        pos: {
          x: 3,
          y: 12,
        },
        width: 3,
        height: 4,
      },
      {
        pos: {
          x: 9,
          y: 17,
        },
        width: 5,
        height: 2,
      },
      {
        pos: {
          x: 14,
          y: 15,
        },
        width: 5,
        height: 4,
      },
      {
        pos: {
          x: 14,
          y: 7,
        },
        width: 4,
        height: 1,
      },
      {
        pos: {
          x: 18,
          y: 7,
        },
        width: 1,
        height: 4,
      },
      {
        pos: {
          x: 14,
          y: 10,
        },
        width: 4,
        height: 1,
      },
      {
        pos: {
          x: 16,
          y: 0,
        },
        width: 6,
        height: 4,
      },
      {
        pos: {
          x: 22,
          y: 0,
        },
        width: 7,
        height: 9,
      },
      {
        pos: {
          x: 22,
          y: 13,
        },
        width: 3,
        height: 7,
      },
      {
        pos: {
          x: 28,
          y: 13,
        },
        width: 4,
        height: 7,
      },
    ],
    agents: [
      {
        path: [
          {
            x: 10,
            y: 2,
          },
          {
            x: 13,
            y: 2,
          },
        ],
      },
      {
        path: [
          {
            x: 7,
            y: 15,
          },
          {
            x: 7,
            y: 20,
          },
        ],
      },
      {
        path: [
          {
            x: 13,
            y: 9,
          },
          {
            x: 13,
            y: 13,
          },
          {
            x: 20,
            y: 13,
          },
          {
            x: 20,
            y: 6,
          },
        ],
      },
      {
        path: [
          {
            x: 23,
            y: 11,
          },
          {
            x: 29,
            y: 11,
          },
        ],
      },
    ],
    start: { x: 1, y: 1  },
    end: { x: 31, y: 1 },
    goal: { x: 16, y: 9 },
  },
];

export default levels;
