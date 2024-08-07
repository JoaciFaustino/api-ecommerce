import { FilterQuery } from "mongoose";

export type LookupPipeline = {
  $lookup: {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
  };
};

export type UnwindPipeline = {
  $unwind: {
    path: string;
    preserveNullAndEmptyArrays: boolean;
  };
};

export type MatchPipeline = { $match: FilterQuery<any> };

export type TupleJoinPipelines =
  | [LookupPipeline, UnwindPipeline, MatchPipeline?]
  | [LookupPipeline, MatchPipeline?];

export interface JoinColectionData {
  colectionName: string;
  localField: string;
  relationship: "one-to-many" | "one-to-one";
  filters: string[] | number[];
  joinFieldNameToQuery?: string;
}

export const getJoinPipelines = (
  joinData: JoinColectionData
): TupleJoinPipelines => {
  const {
    colectionName,
    localField,
    filters,
    relationship,
    joinFieldNameToQuery
  } = joinData;

  const colectionAlias = localField + "Details";

  const LookupPipeline: LookupPipeline = {
    $lookup: {
      from: colectionName,
      foreignField: "_id",
      localField: localField,
      as: localField + "Details"
    }
  };

  const unwindPipeline: UnwindPipeline = {
    $unwind: {
      path: "$" + localField + "Details",
      preserveNullAndEmptyArrays: true
    }
  };

  const fieldNameToQuery: string = joinFieldNameToQuery
    ? colectionAlias + "." + joinFieldNameToQuery
    : colectionAlias;

  const matchPipeline: MatchPipeline | undefined =
    filters.length > 0
      ? { $match: { [fieldNameToQuery]: { $in: filters } } }
      : undefined;

  if (relationship === "one-to-one") {
    return [LookupPipeline, unwindPipeline, matchPipeline];
  }

  return [LookupPipeline, matchPipeline];
};

export const leaveJoinsWithoutFiltersLast = (
  joinPipelines: TupleJoinPipelines[]
): (LookupPipeline | UnwindPipeline | MatchPipeline)[] => {
  const sequencedJoins: TupleJoinPipelines[] = joinPipelines.reduce(
    (joinsAcummulator: TupleJoinPipelines[], join: TupleJoinPipelines) => {
      const lastIndex = join.length - 1;

      const filterMatchExist = join[lastIndex] === undefined;

      if (!filterMatchExist) {
        return [...joinsAcummulator, join];
      }

      return [join, ...joinsAcummulator];
    },
    []
  );

  const pipelinesInOnlyOneArray = sequencedJoins.flat();

  const cleanPipelines = pipelinesInOnlyOneArray.filter(
    (pipeline) => pipeline !== undefined
  ) as (LookupPipeline | UnwindPipeline | MatchPipeline)[];

  return cleanPipelines;
};
