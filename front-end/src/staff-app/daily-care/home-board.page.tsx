import React, { useState, useEffect, useContext, memo } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { OperationsHandlerContext } from "staff-app/daily-care/daily-staff.context"

export const HomeBoardPage: React.FC = memo(() => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [studentsData, setStudentsData] = useState<Person[] | undefined>([])
  const { updateGlobalStudentsData, setStudentsDataDispatchAction } = useContext(OperationsHandlerContext)

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    if (loadState === "loaded") {
      setStudentsData(data?.students)
      updateGlobalStudentsData(data?.students || [])
      setStudentsDataDispatchAction(setStudentsData)
    }
  }, [loadState])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentsData && (
          <>
            {studentsData.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
})

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick } = props
  const { search, sortData } = useContext(OperationsHandlerContext)
  const [sortOrder, setSortOrder] = useState<{ key: string; order: string }>({ key: "", order: "" })
  let timer: NodeJS.Timeout

  useEffect(() => {
    if (!!sortOrder.key && !!sortOrder.order) sortData(sortOrder)
  }, [sortOrder.key, sortOrder.order])

  const onSortClick = (key: string) => {
    setSortOrder({ key: key, order: sortOrder.key === key && sortOrder.order === "asc" ? "dec" : "asc" })
  }

  return (
    <S.ToolbarContainer>
      <S.NameWithSort onClick={() => onSortClick("first_name")}>
        <div>First Name</div>
        {sortOrder.key === "first_name" && <FontAwesomeIcon icon={sortOrder.order === "asc" ? "caret-up" : "caret-down"} size={"2x"} />}
      </S.NameWithSort>
      <S.NameWithSort onClick={() => onSortClick("last_name")}>
        <div>Last Name</div>
        {sortOrder.key === "last_name" && <FontAwesomeIcon icon={sortOrder.order === "asc" ? "caret-up" : "caret-down"} size={"2x"} />}
      </S.NameWithSort>
      <S.SearchBar
        placeholder="Search"
        onChange={(e) => {
          clearTimeout(timer)
          timer = setTimeout(() => {
            search(e.target.value)
          }, 2000)
        }}
      />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  SearchBar: styled.input`
    border-radius: 5px;
    height: 100%;
    padding: 0 5px;
  `,
  NameWithSort: styled.div`
    display: flex;
    align-items: center;
  `,
}
