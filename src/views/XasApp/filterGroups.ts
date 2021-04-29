export const filterGroups = [
  {
    name: 'XAS Composition',
    alwaysExpanded: true,
    filters: [
      {
        name: 'Edge',
        id: 'edge',
        type: 'SELECT',
        props: {
          options: [
            {
              label: 'K-edge',
              value: 'K',
            },
            {
              label: 'L2-edge',
              value: 'L2',
            },
            {
              label: 'L3-edge',
              value: 'L3',
            },
            {
              label: 'L23-edge',
              value: 'L2,3',
            },
          ],
          defaultValue: 'K',
          isClearable: false,
        },
      },
      {
        name: 'Absorbing Element',
        id: 'absorbing_element',
        type: 'MATERIALS_INPUT',
        props: {
          field: 'absorbing_element',
        },
      },
      {
        name: 'Other Elements',
        id: 'elements',
        type: 'MATERIALS_INPUT',
        props: {
          field: 'elements',
        },
      },
      {
        name: 'Formula',
        id: 'formula',
        type: 'MATERIALS_INPUT',
        props: {
          field: 'formula',
        },
      },
    ],
  },
];