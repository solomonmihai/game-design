const levels = [
  {
    bounds: {
      x: 0,
      y: 0,
      width: 20,
      height: 20,
    },
    blocks: [
      {
        pos: {
          x: 10,
          y: 10,
        },
        width: 4,
        height: 3,
      },
    ],
    agents: [
      {
        path: [
          {
            x: 6,
            y: 6,
          },
          {
            x: 12,
            y: 8,
          },
          {
            x: 8,
            y: 12,
          },
        ],
      },
    ],
    start: { x: 5, y: 0 },
    end: { x: 20, y: 20 },
    goal: { x: 10, y: 10 },
  },
];

export default levels;
