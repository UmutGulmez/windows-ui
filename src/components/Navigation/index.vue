<template>
  <div v-click-outside="hide">
    <div class="navigation">
      <div class="navigation-bar">
        <button
          class="navigation-button"
          @click="navigationMenuView = !navigationMenuView"
        >
          <i class="fab fa-windows"></i>
        </button>
        <NavFolderList />
      </div>
      <ul class="detail">
        <li>
          <i class="fas fa-chevron-up"></i>
        </li>
        <li>
          <i class="fas fa-microphone"></i>
        </li>
        <li class="battery">
          <p
            v-if="Number(battery.level) === 100 && battery.charging"
            class="full"
          >
            Fully charged ({{ battery.level }}%)
          </p>
          <p v-else-if="battery.charging">
            {{ battery.level }}% usable. (charging)
          </p>
          <p v-else class="remaining">Remaining {{ battery.level }}%</p>
          <i class="fas fa-battery-three-quarters"></i>
        </li>
        <li>
          <i class="fas fa-wifi"></i>
        </li>
        <li
          class="volume"
          :class="{ active: volume.modal }"
          @click="toggleValumeModal"
        >
          <i class="fas fa-volume-mute" v-if="Number(volume.value) === 0"></i>
          <i class="fas fa-volume-down" v-else-if="volume.value < 50"></i>
          <i class="fas fa-volume-up" v-else></i>
        </li>
        <li>
          <p>ENG</p>
        </li>
        <li @click="toggleCalendarModal" :class="{ active: calendar }">
          <p class="time">{{ time }}</p>
        </li>
      </ul>
      <transition name="fade">
        <NavMenu
          @sleep="sleep = $event"
          @reloadStatus="reloadStatus = $event"
          @shutDownStatus="shutDownStatus = $event"
          v-if="navigationMenuView"
          :menuView="navigationMenuView"
          @hideMenu="navigationMenuView = $event"
        />
      </transition>
      <transition name="opacity">
        <div class="shut-down" v-if="sleep"></div>
      </transition>
      <transition name="fade">
        <div class="reload-animation" v-if="reloadStatus">
          <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p>Restarting</p>
        </div>
      </transition>
      <transition name="fade">
        <div class="reload-animation" v-if="shutDownStatus">
          <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p>Shutting Down</p>
        </div>
      </transition>
    </div>

    <transition name="fade-default">
      <Calendar :timeSecond="timeSecond" v-if="calendar" />
    </transition>
    <transition name="fade-default">
      <NavVolume
        :volume="volume.value"
        @volume="volume.value = $event"
        v-if="volume.modal"
      />
    </transition>
  </div>
</template>

<script>
import NavMenu from "./NavMenu";
import NavFolderList from "./NavFolderList";
import Calendar from "./NavCalendar.vue";
import NavVolume from "./NavVolume.vue";
export default {
  name: "Navigation",
  data() {
    return {
      time: null,
      timeSecond: null,
      navigationMenuView: false,
      sleep: false,
      reloadStatus: false,
      shutDownStatus: false,
      battery: {
        level: null,
        charging: false,
      },
      calendar: false,
      volume: {
        modal: false,
        value: 100,
      },
    };
  },
  components: { NavFolderList, NavMenu, Calendar, NavVolume },
  methods: {
    hide() {
      this.navigationMenuView = false;
      this.calendar = false;
      this.volume.modal = false;
    },
    toggleValumeModal() {
      this.navigationMenuView = false;
      this.calendar = false;
      this.volume.modal = !this.volume.modal;
    },
    toggleCalendarModal() {
      this.navigationMenuView = false;
      this.volume.modal = false;
      this.calendar = !this.calendar;
    },
  },
  created() {
    setInterval(() => {
      const date = new Date();
      const hours =
        date.getHours().toString().length < 2
          ? "0" + date.getHours()
          : date.getHours();
      const minutes =
        date.getMinutes().toString().length < 2
          ? "0" + date.getMinutes()
          : date.getMinutes();
      this.time = hours + ":" + minutes;
      const seconds =
        date.getSeconds().toString().length < 2
          ? "0" + date.getSeconds()
          : date.getSeconds();

      this.time = `${hours}:${minutes}`;
      this.timeSecond = `${hours}:${minutes}:${seconds}`;
    }, 100);
    navigator.getBattery().then((battery) => {
      this.battery.level = battery.level * 100;
      this.battery.charging = battery.charging;
    });
  },
};
</script>

<style lang="scss" scoped>
*::selection {
  background: none;
}
.dark {
  .navigation {
    background: #111;

    &-bar {
      .navigation-button {
        i {
          color: #e9e9e9;
        }
        &:hover i {
          color: #00a2ed;
        }
      }
    }
    .detail {
      & > * {
        color: #e9e9e9;
        &:hover,
        &.active {
          background: lighten(#333, 7%);
        }
      }
      li.battery p {
        background: #333;
        color: #e9e9e9;
      }
    }
  }
}
.navigation {
  position: relative;
  max-width: 100vw;
  height: 35px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  &-bar {
    height: 100%;
    display: flex;
    .navigation-button {
      height: 100%;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover i {
        color: #00a2ed;
      }
      i {
        transition: 150ms;
        font-size: 20px;
      }
    }
  }

  .detail {
    height: 100%;
    display: flex;
    padding-right: 20px;
    font-size: 14px;
    & > * {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      cursor: default;
      padding: 0 5px;
      transition: 150ms;
      &:hover,
      &.active {
        background: lighten(#ddd, 7%);
      }
    }
    li {
      &:not(:last-child) {
        margin-right: 4px;
      }
      &.battery {
        position: relative;
        &:hover p {
          visibility: visible;
          opacity: 1;
        }
        p {
          position: absolute;
          top: -70%;
          left: -60%;
          min-width: 150px;
          padding: 4px 5px;
          background: #ddd;
          border: 1px solid rgba(black, 0.4);
          font-size: 12px;
          text-align: center;
          visibility: hidden;
          opacity: 0;
          transition: all 250ms;
          &.remaining {
            min-width: 108px;
          }
          &.full {
            min-width: 130px;
          }
        }
      }
      &.volume {
        width: 22px;
      }
    }
  }
}

.shut-down {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: black;
  top: 0;
  left: 0;
  z-index: 9999;
  cursor: none;
}

.reload-animation {
  cursor: none;
  position: fixed;
  min-width: 100vw;
  min-height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(62, 62, 189);
  z-index: 999;
  p {
    font-size: 22px;
    margin-top: 10px;
    font-weight: 500;
    color: #ddd;
  }
}

.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
  }
  div:after {
    content: " ";
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    margin: -4px 0 0 -4px;
  }
  div:nth-child(1) {
    animation-delay: -0.036s;
  }
  div:nth-child(1):after {
    top: 63px;
    left: 63px;
  }
  div:nth-child(2) {
    animation-delay: -0.072s;
  }
  div:nth-child(2):after {
    top: 68px;
    left: 56px;
  }
  div:nth-child(3) {
    animation-delay: -0.108s;
  }
  div:nth-child(3):after {
    top: 71px;
    left: 48px;
  }
  div:nth-child(4) {
    animation-delay: -0.144s;
  }
  div:nth-child(4):after {
    top: 72px;
    left: 40px;
  }
  div:nth-child(5) {
    animation-delay: -0.18s;
  }
  div:nth-child(5):after {
    top: 71px;
    left: 32px;
  }
  div:nth-child(6) {
    animation-delay: -0.216s;
  }
  div:nth-child(6):after {
    top: 68px;
    left: 24px;
  }
  div:nth-child(7) {
    animation-delay: -0.252s;
  }
  div:nth-child(7):after {
    top: 63px;
    left: 17px;
  }
  div:nth-child(8) {
    animation-delay: -0.288s;
  }
  div:nth-child(8):after {
    top: 56px;
    left: 12px;
  }
}

@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transform: scale(1);
  transition: 250ms;
}
.fade-enter,
.fade-leave-to {
  transform: translate(-30px, 50px) scale(0.8);
  opacity: 0;
}

.fade-default-enter-active,
.fade-default-leave-active {
  transform: translateY(0);
  transition: 250ms;
}
.fade-default-enter,
.fade-default-leave-to {
  transform: translateY(50px);
  opacity: 0;
}

.opacity-enter-active,
.opacity-leave-active {
  transition: 300ms;
}
.opacity-enter,
.opacity-leave-to {
  opacity: 0;
  transition: 800ms;
}
</style>
