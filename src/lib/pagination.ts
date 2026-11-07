// import { db } from "./prisma";

// type PrismaModelName = "product" | "categorie" | "order";

// interface GetPaginationProps {
//   perPageData?: number;
//   currentPage?: number;
//   dbName: PrismaModelName;
// }

// export const getPagination = async ({
//   perPageData = 5,
//   currentPage = 1,
//   dbName,
// }: GetPaginationProps) => {
//   const take = Math.max(1, perPageData);
//   const page = Math.max(1, currentPage);

//   const skip = (page - 1) * take;

//   const model = db[dbName];

//   const [data, totalRecords] = await Promise.all([
//     model.findMany({
//       skip,
//       take,
//     }),

//     model.count(),
//   ]);

//   return {
//     data,
//     totalRecords,
//     currentPage: page,
//     perPageData: take,
//     totalPages: Math.ceil(totalRecords / take),
//   };
// };