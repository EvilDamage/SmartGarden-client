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
  sensorReads {
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

export const CURRENT_SENSOR_READS = gql`
query Query {
      currentSensorsReading {
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

export const GET_SETTINGS = gql`
query Query {
  settings {
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
