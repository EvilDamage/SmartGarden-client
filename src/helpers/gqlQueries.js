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

export const REFRESH_TOKEN = gql`
mutation Mutation($refresh_token: String!) {
  refreshToken(refresh_token: $refresh_token) {
    access_token
    refresh_token
  }
}
`

export const CONFIRM_EMAIL = gql`
mutation Mutation($token: String!) {
  confirmEmail(token: $token)
}
`

export const RESET_PASSWORD = gql`
mutation Mutation($email: String!) {
  resetPassword(email: $email)
}
`

export const SET_NEW_PASSWORD = gql`
mutation Mutation($token: String!, $password: String!) {
  setNewPassword(token: $token, password: $password)
}
`

export const GET_USER = gql`
query Query {
  me{
    id
    email
    name
    confirmed
    role
    notifications
    notifications_alerts
    created_at
    updated_at
  }
}
`

export const GET_USERS = gql`
query Query {
  users{
    id
    email
    name
    confirmed
    confirmed_by_admin
    role
    created_at
    updated_at
  }
}
`

export const EDIT_USER = gql`
mutation Mutation($email: String, $password: String, $oldPassword: String!, $name: String, $notifications: Boolean, $notifications_alerts: Boolean) {
  editUser(email: $email, password: $password, oldPassword: $oldPassword, name: $name, notifications: $notifications, notifications_alerts: $notifications_alerts){
      id
      name
      email
  }
}
`

export const EDIT_USER_PERMISSION = gql`
mutation Mutation($id: ID!, $role: String, $confirmed_by_admin: Boolean) {
  editUserPermission(id: $id, role: $role, confirmed_by_admin: $confirmed_by_admin)
}
`

export const ADD_USER = gql`
mutation Mutation($email: String!) {
  inviteUser(email: $email)
}
`

export const REGISTER_INVITED_USER = gql`
mutation Mutation($token: String!, $password: String!, $name: String!) {
  invitationUserRegister(token: $token, password: $password, name: $name)
}
`

export const DELETE_USER = gql`
mutation Mutation($id: ID!) {
  deleteUser(id: $id)
}
`

export const HISTORY = gql`
query Query ($offset: Int, $limit: Int){
  history(offset: $offset, limit: $limit){
    totalLength
    hasMore
    history{
        id
        comment
        created_at
    }
  }
}
`

export const SENSOR_READS = gql`
query Query ($start_date: String, $end_date: String){
  sensorReads(start_date: $start_date, end_date: $end_date){
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

export const GET_PLAN = gql`
query Query ($id: ID){
  profile(id: $id){
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
        started_at
        created_at
        updated_at
    }
}
`

export const GET_PLANS = gql`
query Query ($offset: Int, $limit: Int){
  profiles(offset: $offset, limit: $limit){
    totalLength
    hasMore
    profiles{
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
        started_at
        created_at
        updated_at
    }
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

export const MANUAL_PLAN = gql`
query Query{
  manualProfile{
    air_humidity
    soil_humidity
    air_temperature
    light {
        start_hour
        end_hour
        minimumLevel
    }
    fertilizer,
    fertilizer_interval,
    created_at
    updated_at
  }
}
`

export const MANUAL_CONTROL = gql`
    mutation Mutation($pump: Int, $pump_fertilizer: Int, $fan: Int, $light: Boolean){
        manualControl(pump: $pump, pump_fertilizer: $pump_fertilizer, fan: $fan, light: $light)
    }
`

export const EMERGENCY_STOP = gql`
    mutation Mutation($stop: Boolean){
        emergencyStop(stop: $stop)
    }
`

export const ADD_MANUAL_PLAN = gql`
mutation Mutation ($air_humidity: Int, $soil_humidity: Int, $air_temperature: Int, $light: LightTimetableInput, $fertilizer: Int, $fertilizer_interval: Int){
  addManualProfile (air_humidity: $air_humidity, soil_humidity: $soil_humidity, air_temperature: $air_temperature, light: $light, fertilizer: $fertilizer, fertilizer_interval: $fertilizer_interval){
    air_humidity
    soil_humidity
    air_temperature
    light {
        start_hour
        end_hour
        minimumLevel
    }
    fertilizer,
    fertilizer_interval,
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
