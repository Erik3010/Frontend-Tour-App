<template>
    <div>
        <LoginModal
            :status="modalStatus"
            v-show="modalStatus"
            @close="modalStatus = 0"
            @login="loginUser"
        ></LoginModal>
        <div class="wrapper">
            <div class="container">
                <aside class="side">
                    <div class="item action">
                        <ul class="nav">
                            <li v-show="!token">
                                <a href="#" @click.prevent="modalStatus = 1">Login</a>
                            </li>
                            <li v-show="token">
                                <a @click.prevent="logout" href="#">Logout</a>
                            </li>
                            <li v-show="token">
                                <a>{{ username }}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="item form">
                        <h1 role="heading" class="heading">Tuk Tuk Tour</h1>
                        <div class="admin-dash">
                            <router-link
                                to="/admin"
                                class="btn btn-submit"
                                v-if="role == 'ADMIN'"
                            >Admin Dashboard</router-link>
                        </div>
                        <div class="panel-content">
                            <form role="form">
                                <BaseInput
                                    v-if="places.length > 0"
                                    :placeArray="places"
                                    label="From"
                                    placeholder="From: "
                                    @input="getID(...arguments, 'from')"
                                    @selection="getID(...arguments, 'from')"
                                ></BaseInput>
                                <BaseInput
                                    v-if="places.length > 0"
                                    :placeArray="places"
                                    label="To"
                                    placeholder="To: "
                                    @input="getID(...arguments, 'to')"
                                    @selection="getID(...arguments, 'to')"
                                >
                                </BaseInput>
                                <!-- <div class="form-group">
                                    <label for="">To: </label>
                                    <input
                                        type="text"
                                        name="target"
                                        placeholder="Target: "
                                        class="input"
                                        v-model="route.to_place_id"
                                    >
                                </div> -->
                                <div class="form-group">
                                    <label for="">Departure Time (Optional)</label>
                                    <input
                                        type="time"
                                        name="departureTime"
                                        placeholder="Departure Time: "
                                        class="input"
                                        v-model="route.departure_time"
                                    >
                                </div>
                                <div class="form-group form-content-right">
                                    <button
                                        type="submit"
                                        class="btn btn-submit"
                                        @click.prevent="searchRoute"
                                    >Get Routes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="item panel-list">
                        <div class="error" v-show="error.length">
                            <h2>{{ error[0] }}</h2>
                        </div>
                        <ul class="result-list">
                            <li
                                v-for="route in routeLists"
                                :key="route.id"
                                @click="showLine(route.id)"
                            >
                                <ul class="result-detail">
                                    <li>
                                        <label>From: </label>
                                        <p>{{ route.from_place.name }}</p>
                                    </li>
                                    <li>
                                        <label>To: </label>
                                        <p>{{ route.to_place.name }}</p>
                                    </li>
                                    <li>
                                        <label>Time Schedule: </label>
                                        <p>{{ route.departure_time }} - {{ route.arrival_time }}</p>
                                    </li>
                                </ul>
                            </li>
                            <li v-show="isNoRoute">No Route Found</li>
                            <!-- <li>
                                <ul class="result-detail">
                                    <li>
                                        <label>From: </label>
                                        <p>-</p>
                                    </li>
                                    <li>
                                        <label>To: </label>
                                        <p>-</p>
                                    </li>
                                    <li>
                                        <label>Time Schedule: </label>
                                        <p>-</p>
                                    </li>
                                </ul>
                            </li> -->
                        </ul>
                    </div>
                </aside>
                <main class="map">
                    <div class="map-container">
                        <div class="map-bg">
                            <img src="@/assets/map.svg">
                        </div>
                        <!-- map marker -->
                        <div
                            v-for="(place,i) in places"
                            :key="place.id"
                            class="dot"
                            :style="placeData.styles[i]"
                            @click="placeModal(place.id)"
                        >
                            <div class="dot-circle">{{ place.id }}</div>
                        </div>
                        <!-- place label name -->
                        <div
                            v-for="(label,i) in labelData.names"
                            :key="label.id"
                            class="place-name"
                            :style="labelData.styles[i]"
                        >{{ label.name }}</div>
                        <!-- draw line -->
                        <div
                            class="line"
                            :style="lineStyle"
                            v-show="isShowLine"
                        ></div>
                        <!-- map legend -->
                        <div class="legend">
                            <div v-for="(c,i) in color" :key="c" class="legend-wrap">
                                <div
                                    class="sample-color"
                                    :style="legendColor[i]"
                                ></div>
                                <div class="label-color">Line {{ i+1 }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- place detail modal -->
                    <div
                        class="place-modal"
                        v-if="isPlaceOpen"
                        :style="placeModalStyle"
                    >
                        <div class="place-img">
                            <img :src="'http://localhost:8000/images/'+selectedPlace.image_path" alt="Image Place">
                        </div>
                        <div class="place-data">
                            <h3>{{ selectedPlace.name }}</h3>
                            <p>{{ selectedPlace.description }}</p>
                            <p class="history">Searched by: <span>10</span> peoples</p>
                            <button
                                @click.prevent="isPlaceOpen = 0"
                                class="btn btn-edit"
                            >Close</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>

</template>

<script>
import LoginModal from '@/components/LoginModal.vue';
import BaseInput from '@/components/Util/BaseInput.vue';

export default {
    components: { LoginModal, BaseInput },
    data() {
        return {
            domain: 'http://localhost:8000/api/v1',
            places: [],
            modalStatus: 0,
            token: localStorage.getItem('token'),
            role: localStorage.getItem('role'),
            username: localStorage.getItem('username'),
            route: { from_place_id: '', to_place_id: '', departure_time: "null" },
            routeLists: [],
            error: [],
            placeData: {
                id: [],
                type: [],
                styles: []
            },
            labelData: {
                names: [],
                styles: []
            },
            selectedPlace: [],
            isPlaceOpen: 0,
            placeModalStyle: {},
            isShowLine: 0,
            lineStyle: [],
            isNoRoute: 0,
            color: ['#D81E5B', '#59C9A5', '#23395B', '#F58F29', '#FE6847', '#7F2CCB', '#FF84E8', '#FFDA22', '#35FF69', '#256EFF', '#46237A', '#50514F'],
            legendColor: []
        }
    },
    created() {
        this.fetchPlace();
        this.generateLegendColor();
    },
    methods: {
        fetchPlace() {
            axios.get(`${this.domain}/place?token=${this.token}`)
                .then(res => {
                    this.places = res.data
                    console.log(this.places)
                    this.drawPlace(res.data);

                    // console.log(this.places)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        drawPlace(data) {
            data.forEach((place, i) => {
                this.placeData.id.push(place.id);

                this.placeData.type.push({type: place.type})

                this.placeData.styles.push({
                    left: `${place.x}px`,
                    top: `${place.y}px`,
                    background: (place.type == "ATTRACTIONS") ? '#CC0000' : 'green'
                });
            })

            this.drawLabel(data);
        },
        drawLabel(data) {
            data.forEach((place, i) => {
                this.labelData.names.push({
                    name: place.name
                })

                this.labelData.styles.push({
                    left: `${place.x-25}px`,
                    top: `${place.y+5}px`
                });
            })
        },
        placeModal(id) {
            this.isPlaceOpen = 1;

            let res = this.places.filter((place) => {
                return place.id == id
            })
            this.selectedPlace = res[0];

            this.selectedPlace.description = `${this.selectedPlace.description.substr(0,100)}...`;

            this.placeModalStyle = {
                left: `${this.selectedPlace.x}px`,
                top: `${this.selectedPlace.y}px`
            };
        },
        loginUser(data) {
            axios.post(`${this.domain}/auth/login`, data)
                .then(res => {
                    alert('login success')
                    this.modalStatus = 0;
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('role', res.data.role)
                    localStorage.setItem('username', res.data.username);

                    if(!this.places.length) this.fetchPlace();

                    this.token = res.data.token;
                    this.username = res.data.username;
                    this.role = res.data.role
                })
                .catch(err => {
                    alert(err.response.data.message)
                    // console.log(err)
                })
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('username');

            this.token = null;
            this.role = null;
        },
        searchRoute() {
            this.error = [];
            this.isNoRoute = 0;
            axios.get(`${this.domain}/route/search/${this.route.from_place_id}/${this.route.to_place_id}/${this.route.departure_time}?token=${this.token}`)
                .then(res => {
                    console.log(res.data)
                    this.routeLists = res.data.schedules;
                    if(!res.data.schedules) {
                        this.showRoute(this.route);
                        this.isNoRoute = 1;
                    }
                    this.isShowLine = 0;
                    // console.log(res.data.schedules)
                })
                .catch(err => {
                    this.routeLists = [];
                    this.error.push(err.response.data.message)
                    console.log(err.response.data.message)
                })
        },
        showRoute(route) {
            let from_id = this.places.filter(place => place.id == route.from_place_id)[0].id;
            let to_id = this.places.filter(place => place.id == route.to_place_id)[0].id;

            let placeDataFromId = this.placeData.id.findIndex(i => i == from_id);
            let placeDataToId = this.placeData.id.findIndex(i => i == to_id);

            // console.log(placeDataFromId, placeDataToId);

            for(let i=0;i<this.placeData.id.length;i++) {
                // if(this.placeData.id[i] == placeDataFromId || this.placeData.id[i] == placeDataToId) continue;
                if(this.placeData.id[i] != placeDataFromId || this.placeData.id[i] != placeDataToId) {
                    let color = (this.placeData.type[i].type == "ATTRACTIONS") ? '#CC0000' : 'green'
                    this.placeData.styles[i].background = color;
                }
            }


            this.placeData.styles[placeDataFromId].background = '#3e7696';
            this.placeData.styles[placeDataToId].background = '#3e7696';
        },
        getID(data, cond) {
            let res = this.places.filter(place => {
                return place.name == data
            })

            if(!res.length) return;

            if(cond === "from") this.route.from_place_id = res[0].id;
            else if(cond === "to") this.route.to_place_id = res[0].id
        },
        showLine(id) {
            this.isShowLine = 1;
            this.storeHistory(id);

            let routeData = this.routeLists.filter((route) => {
                return route.id == id
            })[0];

            let from = routeData.from_place;
            let to = routeData.to_place;

            let lineWidth = Math.hypot(to.x - from.x, to.y - from.y);
            let angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
            // console.log(angle);

            this.lineStyle = {
                top: `${from.y}px`,
                left: `${from.x}px`,
                transform: `translate(0, 5px) rotate(${angle}deg)`,
                width: `${lineWidth}px`,
                background: this.color[routeData.line-1],
                animation: `line 2s`
            }
        },
        storeHistory(id) {
            let schedulesArr = [];
            let schedules = this.routeLists.forEach((route, i) => {
                schedulesArr.push(route.id)
            })

            let routeData = this.routeLists.filter(route => route.id == id)[0];
            // console.log(routeData.from_place.id, routeData.to_place.id);

            let data = {
                from_place_id: routeData.from_place.id,
                to_place_id: routeData.to_place.id,
                schedule_id: schedulesArr
            };

            axios.post(`${this.domain}/route/selection?token=${this.token}`, data)
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
            // console.log(routeData)
        },
        generateLegendColor() {
            this.color.forEach((c,i) => {
                this.legendColor.push({
                    background: c
                })
            })
        }
    }
}
</script>