import React from "react"
import styled from "styled-components"

import { Activity } from "shared/models/activity"
import { Spacing, BorderRadius } from "shared/styles/styles"

interface ActivityTileProps {
  activityData: Activity
}

export const ActivityTile: React.FC<ActivityTileProps> = ({ activityData }) => {
  const attendanceData = activityData?.entity?.student_roll_states?.reduce(
    (acc, i) => {
      acc[i.roll_state] += 1
      return acc
    },
    { absent: 0, present: 0, late: 0, unmark: 0 }
  )
  if (activityData?.entity) {
    return (
      <>
        {activityData.entity.name}
        <S.ActivityTile>
          <p>
            <b>Date:</b>
            {new Date(activityData.date).toDateString()}
          </p>
          <S.AttendanceContainer>
            <S.Present>{attendanceData.present}</S.Present>
            <S.Late>{attendanceData.late}</S.Late>
            <S.Absent>{attendanceData.absent}</S.Absent>
          </S.AttendanceContainer>
        </S.ActivityTile>
      </>
    )
  }
  return null
}

const S = {
  ActivityTile: styled.div`
    display: flex;
    border-radius: ${BorderRadius.default};
    background-color: #d3d3d3;
    padding: 5px;
    margin: 10px;
  `,
  AttendanceContainer: styled.div`
    display: flex;
    width: 50%;
    justify-content: space-evenly;
  `,
  Present: styled.p`
    background-color: #13943b;
    color: white;
    border-radius: ${BorderRadius.rounded};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    height: ${Spacing.u10};
    width: ${Spacing.u10};
  `,
  Absent: styled.p`
    background-color: #9b9b9b;
    color: white;
    border-radius: ${BorderRadius.rounded};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    height: ${Spacing.u10};
    width: ${Spacing.u10};
  `,
  Late: styled.p`
    background-color: #f5a623;
    color: white;
    border-radius: ${BorderRadius.rounded};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    height: ${Spacing.u10};
    width: ${Spacing.u10};
  `,
}
