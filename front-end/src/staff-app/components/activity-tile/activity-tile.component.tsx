import React from "react"

import { Activity } from "shared/models/activity"
import styled from "styled-components"
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
      <S.ActivityTile>
        <S.Index>{activityData.entity.name}</S.Index>
        <p>{new Date(activityData.date).toDateString()}</p>
        <p>{attendanceData.present}</p>
        <p>{attendanceData.late}</p>
        <p>{attendanceData.absent}</p>
      </S.ActivityTile>
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
  `,
  Index: styled.div`
    background-color: blueviolet;
    color: white;
    border-radius: ${BorderRadius.rounded};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${Spacing.u1};
  `,
}
