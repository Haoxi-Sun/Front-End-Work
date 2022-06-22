export const breadcrumbsRoutes = [
  {
    path: "/dashboard/overview",
    key: "1",
    name: "Overview",
  },
  {
    key: "sub1",
    name: "Student",
    children: [
      {
        path: "/dashboard/students",
        name: "Student List",
        key: '2',
        children: [
          {
            path: "/dashboard/students/:id",
            name: "Detail",
          },
        ],
      },
    ]
  },
];
