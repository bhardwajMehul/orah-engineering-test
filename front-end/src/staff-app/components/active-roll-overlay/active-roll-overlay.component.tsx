import React, { useState, useContext, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { RolllStateType } from "shared/models/roll"
import { OperationsHandlerContext } from "staff-app/daily-care/daily-staff.context"
import { useApi } from "shared/hooks/use-api"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick } = props
  const [attendance, setAttendance] = useState<{ [key in RolllStateType]: number }>({ unmark: 0, late: 0, present: 0, absent: 0 })
  const { setAttendanceDispatchAction, sortData, totalStudentsCount, getAttendanceDataWithMapping } = useContext(OperationsHandlerContext)

  const [saveRollData, data] = useApi<{ success: boolean }>({ url: "save-roll" })

  useEffect(() => {
    setAttendanceDispatchAction(setAttendance)
  }, [])

  useEffect(() => {
    if (data?.success === true) {
      alert("Attendance saved successfully")
    } else if (data?.success === false) {
      alert("There was a problem, please try again.")
    }
  }, [data])

  const submitData = () => {
    if (totalStudentsCount() !== attendance.present + attendance.late + attendance.absent) {
      alert("Please mark the attendance for all students")
    } else {
      saveRollData(getAttendanceDataWithMapping())
      onItemClick("exit")
    }
  }

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: totalStudentsCount() },
              { type: "present", count: attendance.present },
              { type: "late", count: attendance.late },
              { type: "absent", count: attendance.absent },
            ]}
            onItemClick={(type) => sortData(type)}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={submitData}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
