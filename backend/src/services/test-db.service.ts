import { db } from "../config/db";

export const fetchTestDbData = async () => {
  return db.user.findMany({
    include: {
      records: true,
    },
  });
};
