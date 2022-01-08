import {gql} from "@apollo/client";

export const REGISTER_USER = gql`
mutation Mutation($email: String!, $password: String!, $name: String!) {
  register(email: $email, password: $password, name: $name)
}
`

export const LOGIN_USER = gql`
mutation Mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    access_token
    refresh_token
  }
}
`

export const RESET_PASSWORD = gql`
mutation Mutation($email: String!) {
  resetPassword(email: $email)
}
`

export const GET_USERS = gql`
query Query {
  users{
    id
    email
    name
    confirmed
    created_at
    updated_at
  }
}
`

export const EDIT_USER = gql`
mutation Mutation($email: String!, $password: String!, $name: String!) {
  editUser(email: $email, password: $password, name: $name){
      id
      name
      email
  }
}
`

export const ADD_USER = gql`
mutation Mutation($email: String!, $name: String!) {
  addUser(email: $email, name: $name)
}
`

export const DELETE_USER = gql`
mutation Mutation($id: ID!) {
  deleteUser(id: $id)
}
`

export const SENSOR_READS = gql`
query Query {
  sensorReads{
    id
    air_humidity
    soil_humidity
    air_temperature
    air_pressure
    light_level
    cpu_temperature
    created_at
  }
}
`

export const LAST_SENSOR_READS = gql`
query Query {
  lastSensorsReading {
    air_humidity
    soil_humidity
    air_temperature
    air_pressure
    light_level
    cpu_temperature
    created_at
  }
}
`

export const UPDATE_SETTINGS = gql`
mutation Mutation ($mode: String, $interval: Int, $current_plan: ID, $pump: Boolean, $pump_fertilizer: Boolean, $light: Boolean, $fan: Boolean){
  updateSettings (mode: $mode, interval: $interval, current_plan: $current_plan, pump: $pump, pump_fertilizer: $pump_fertilizer, light: $light, fan: $fan){
    id
    current_plan
    mode
    interval
    pump
    pump_fertilizer
    light
    fan
    created_at
    updated_at
  }
}
`

export const GET_SETTINGS = gql`
query Query {
  settings {
    mode
    current_plan
    interval
    current_plan
    pump
    pump_fertilizer
    light
    fan
    created_at
    updated_at
  }
}
`

export const GET_PLANS = gql`
query Query ($id: ID){
  profiles (id: $id){
    id
    name
    schedule{
        id
        air_humidity
        soil_humidity
        air_temperature
        light{
            start_hour
            end_hour
            minimumLevel
        }
        duration
    }
    created_at
    updated_at
  }
}
`

export const ADD_PLANS = gql`
mutation Mutation ($name: String!, $schedule: [ScheduleInput!]!){
  addProfile (name: $name, schedule: $schedule){
    name
    schedule{
        air_humidity
        soil_humidity
        air_temperature
        light {
            start_hour
            end_hour
            minimumLevel
        }
        duration
    }
    created_at
    updated_at
  }
}
`

export const DELETE_PLAN = gql`
mutation Mutation($id: ID!) {
  deleteProfile(id: $id)
}
`
