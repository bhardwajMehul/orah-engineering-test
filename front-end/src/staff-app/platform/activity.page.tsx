import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Spacing } from "shared/styles/styles"
import { ActivityTile } from "staff-app/components/activity-tile/activity-tile.component"

export const ActivityPage: React.FC = () => {
  const [activity, setActivity] = useState<Activity[] | undefined>([])

  const [getActivities, data, loadState] = useApi<{ success: boolean; activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    if (loadState === "loaded") {
      setActivity(data?.activity)
    }
  }, [loadState])

  useEffect(() => {
    getActivities()
  }, [getActivities])

  return (
    <S.Container>
      {loadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}

      {loadState === "loaded" && activity && activity.length > 0 && activity.map((i) => i?.entity && <ActivityTile key={i.entity.id} activityData={i} />)}

      {loadState === "error" && <h3>There seems to be some issue</h3>}
      {loadState === "unloaded" && <h3>Failed to get the data</h3>}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
