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

export const EDIT_USER = gql`
mutation Mutation($email: String!, $password: String!, $name: String!) {
  editUser(email: $email, password: $password, name: $name){
      id
      name
      email
  }
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
