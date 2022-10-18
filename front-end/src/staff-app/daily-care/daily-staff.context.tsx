import React, { createContext, useRef, useState, useEffect } from "react"

import { Person } from "shared/models/person"
import { HomeBoardPage } from "staff-app/daily-care/home-board.page"
import { RollStateType } from "shared/models/roll"

interface Context {
  globalStudentsData: Person[]
  studentsAttendanceMap?: { [id: number]: RollStateType }
  search: (val: string, initialData?: Person[]) => void
  updateGlobalStudentsData: (data: Person[]) => void
  sortData: Function
  attendanceMap: { present: number; absent: number; late: number }
  setStudentsDataDispatchAction: (func: React.Dispatch<React.SetStateAction<Person[] | undefined>>) => void
  onPresenceChange: (state: RollStateType, id: number) => void
  setAttendanceDispatchAction: (func: React.Dispatch<React.SetStateAction<{ [presence in RollStateType]: number }>>) => void
  totalStudentsCount: () => number
  getAttendanceDataWithMapping: () => { student_roll_states: { student_id: number; roll_state: RollStateType }[] }
}

export const OperationsHandlerContext = createContext<Context>({
  globalStudentsData: [],
  search: () => {},
  updateGlobalStudentsData: () => {},
  sortData: () => {},
  studentsAttendanceMap: {},
  attendanceMap: { present: 0, absent: 0, late: 0 },
  setStudentsDataDispatchAction: () => {},
  onPresenceChange: () => {},
  setAttendanceDispatchAction: () => {},
  totalStudentsCount: () => {
    return 0
  },
  getAttendanceDataWithMapping: () => ({
    student_roll_states: [],
  }),
})

export const HomeBoardPageWithContext = () => {
  const globalStudentsData = useRef<Person[]>([])
  const studentsDataUpdater = useRef<React.Dispatch<React.SetStateAction<Person[] | undefined>>>(() => {})
  const attendanceUpdater = useRef<React.Dispatch<React.SetStateAction<{ [presence in RollStateType]: number }>>>(() => {})
  const searchParam = useRef("")
  const studentsAttendanceMap: { [id: number]: RollStateType } = {}
  const attendanceMap: { [presence in RollStateType]: number } = { present: 0, absent: 0, late: 0, unmark: 0 }

  const updateGlobalStudentsData = (data: Person[]) => {
    globalStudentsData.current = data
  }
  const setStudentsDataDispatchAction = (func: React.Dispatch<React.SetStateAction<Person[] | undefined>>) => {
    studentsDataUpdater.current = func
  }
  const setAttendanceDispatchAction = (func: React.Dispatch<React.SetStateAction<{ [presence in RollStateType]: number }>>) => {
    attendanceUpdater.current = func
  }

  const search = (val: string, initialData = globalStudentsData.current) => {
    searchParam.current = val
    if (val == "") {
      studentsDataUpdater.current([...initialData])
    } else {
      const data = initialData.filter((i: Person) => {
        let name = `${i.first_name.toLowerCase()} ${i.last_name.toLowerCase()}`
        return name.includes(val)
      })
      studentsDataUpdater.current([...data])
    }
  }

  const sortData = (sortType: "present" | "late" | "absent" | "all" | { key: "first_name" | "last_name"; order: "asc" | "dec" }) => {
    let data = globalStudentsData.current
    if (typeof sortType == "string" && sortType !== "all") {
      data = globalStudentsData.current.filter((i) => {
        return studentsAttendanceMap[i.id] == sortType
      })
    } else if (typeof sortType == "object") {
      data = globalStudentsData.current.sort((a, b) => {
        if (a[sortType.key].toLowerCase() > b[sortType.key].toLowerCase()) {
          return sortType.order === "asc" ? 1 : -1
        } else if (a[sortType.key].toLowerCase() < b[sortType.key].toLowerCase()) {
          return sortType.order === "asc" ? -1 : 1
        }
        return 0
      })
      globalStudentsData.current = data
    }
    search(searchParam.current, data)
  }

  const onPresenceChange = (state: RollStateType, id: number) => {
    if (studentsAttendanceMap[id]) {
      attendanceMap[studentsAttendanceMap[id]] -= 1
    }
    studentsAttendanceMap[id] = state
    attendanceMap[state] += 1
    attendanceUpdater.current({ ...attendanceMap })
  }

  const totalStudentsCount = () => {
    return globalStudentsData.current.length
  }

  const getAttendanceDataWithMapping = () => ({
    student_roll_states: globalStudentsData.current.map((i) => ({
      student_id: i.id,
      roll_state: studentsAttendanceMap[i.id] || "unmark",
    })),
  })

  return (
    <OperationsHandlerContext.Provider
      value={{
        globalStudentsData: globalStudentsData.current,
        search,
        updateGlobalStudentsData,
        sortData,
        studentsAttendanceMap,
        attendanceMap,
        setStudentsDataDispatchAction,
        onPresenceChange,
        setAttendanceDispatchAction,
        totalStudentsCount,
        getAttendanceDataWithMapping,
      }}
    >
      {<HomeBoardPage />}
    </OperationsHandlerContext.Provider>
  )
}
