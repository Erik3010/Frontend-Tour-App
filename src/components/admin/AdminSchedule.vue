<template>
    <div class="container admin">
        <div class="admin-menu">
            <h1>Admin Menu</h1>
            <p>Change the place and schedule</p>
            <router-link to="/admin" class="btn">Place Management</router-link>
        </div>
        <div class="admin-create">
            <div class="item form">
                <h1 role="heading" class="heading">Create Schedule</h1>
                <div class="panel-content">
                    <form role="form">
                        <div class="form-group">
                            <label for="">Line</label>
                            <input
                                type="number"
                                placeholder="Line"
                                class="input"
                                v-model="schedule.line"
                            >
                        </div>
                        <div class="form-group">
                            <label for="">Form Place Id</label>
                            <select
                                class="input"
                                v-model="schedule.from_place_id"
                                @change="checkPlace($event)"
                            >
                                <option
                                    id="from"
                                    v-for="place in places"
                                    :key="place.id"
                                    :value="place.id"
                                >{{ place.name }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="">To Place Id</label>
                            <select
                                class="input"
                                v-model="schedule.to_place_id"
                                @change="checkPlace($event)"
                            >
                                <option id="to" v-for="place in places" :key="place.id" :value="place.id">{{ place.name }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="">Departure Time</label>
                            <input
                                type="time"
                                class="input"
                                v-model="schedule.departure_time"
                            >
                        </div>
                        <div class="form-group">
                            <label for="">Arrival Time</label>
                            <input
                                type="time"
                                class="input"
                                v-model="schedule.arrival_time"
                            >
                        </div>
                        <div class="form-group">
                            <label for="">Distance</label>
                            <input
                                type="number"
                                placeholder="Distance"
                                class="input"
                                v-model="schedule.distance"
                            >
                        </div>
                        <div class="form-group">
                            <label for="">Speed</label>
                            <input
                                type="number"
                                placeholder="Speed"
                                class="input"
                                v-model="schedule.speed"
                            >
                        </div>
                        <div class="form-group form-content-right">
                            <button
                                type="submit"
                                class="btn btn-submit"
                                @click.prevent="createSchedule"
                                v-show="!isEdit"
                            >Create Place</button>
                            <button
                                type="submit"
                                class="btn btn-submit"
                                @click.prevent="updateSchedule"
                                v-show="isEdit"
                            >Update Place</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="admin-table">
            <table class="table">
                <tr>
                    <th>No</th>
                    <th>Line</th>
                    <th>From Place ID</th>
                    <th>To Place ID</th>
                    <th>Departure Time</th>
                    <th>Arrival Time</th>
                    <th>Distance</th>
                    <th>Speed</th>
                    <th>Action</th>
                </tr>
                <tr v-for="(schedule,i) in this.schedules" :key="schedule.id">
                    <td>{{ i+1 }}</td>
                    <td>{{ schedule.line }}</td>
                    <td>{{ schedule.from_place_id }}</td>
                    <td>{{ schedule.to_place_id }}</td>
                    <td>{{ schedule.departure_time }}</td>
                    <td>{{ schedule.arrival_time }}</td>
                    <td>{{ schedule.distance }}</td>
                    <td>{{ schedule.speed }}</td>
                    <td>
                        <button
                            class="btn btn-edit mb-5 mr-5"
                            @click="editSchedule(schedule.id)"
                        >Edit</button>
                        <button
                            class="btn btn-del"
                            @click="deleteSchedule(schedule.id)"
                        >Delete</button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            domain: 'http://localhost:8000/api/v1',
            token: localStorage.getItem('token'),
            places: [],
            schedules: [],
            schedule: {
                line: '',
                from_place_id: '',
                to_place_id: '',
                departure_time: '',
                arrival_time: '',
                distance: '',
                speed: ''
            },
            isEdit: 0
        }
    },
    created() {
        this.fetchPlace();
        this.fetchSchedule();
    },
    methods: {
        fetchPlace() {
            axios.get(`${this.domain}/place?token=${this.token}`)
                .then(res => {
                    this.places = res.data;
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        fetchSchedule() {
            axios.get(`${this.domain}/schedule?token=${this.token}`)
                .then(res => {
                    this.schedules = res.data;
                    // console.log(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        checkPlace(e) {
            let value = e.target.value;
            let option;

            let selector = e.target.firstElementChild.id;

            if(selector==="from") {
                option = document.querySelectorAll('#to');
            }else{
                option = document.querySelectorAll('#from');
            }

            option.forEach((to, i) => {
                if(to.value === value) {
                    to.disabled = true;
                }else{
                    to.disabled = false;
                }
            })
            // console.log(value)
        },
        createSchedule() {
            axios.post(`${this.domain}/schedule?token=${this.token}`, this.schedule)
                .then(res => {
                    alert(res.data.message)
                    this.fetchSchedule();
                })
                .catch(err => {
                    console.log(err)
                })
        },
        editSchedule(id) {
            this.isEdit = 1;
            localStorage.setItem('schedule_id', id);

            let scheduleEdit = this.schedules.filter(schedule => schedule.id == id);
            let s = scheduleEdit[0];

            this.schedule.line = s.line;
            this.schedule.departure_time = s.departure_time;
            this.schedule.arrival_time = s.arrival_time;
            this.schedule.distance = s.distance;
            this.schedule.speed = s.speed;
            this.from_place_id = s.from_place_id;
            this.to_place_id = s.to_place_id;
        },
        updateSchedule() {
            let id = localStorage.getItem('schedule_id');

            axios.put(`${this.domain}/schedule/${id}?token=${this.token}`, this.schedule)
                .then(res => {
                    alert(res.data.message)
                    this.fetchSchedule()
                })
                .catch(err => {
                    console.log(err)
                })
        },
        deleteSchedule(id) {
            axios.delete(`${this.domain}/schedule/${id}?token=${this.token}`)
                .then(res => {
                    alert(res.data.message)
                    this.fetchSchedule();
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}
</script>