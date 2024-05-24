const readline = require("readline");

class AlarmClock {
  constructor() {
    this.alarms = [];
    this.currentTime = new Date();
    this.interval = null;
  }

  startClock() {
    this.interval = setInterval(() => {
      this.currentTime = new Date();
      console.log(this.currentTime.toLocaleTimeString());
      this.checkAlarms();
    }, 1000);
  }

  addAlarm(time, dayOfWeek) {
    this.alarms.push({ time, dayOfWeek, snoozeCount: 0 });
    console.log(`Alarm set for ${time} on day ${dayOfWeek}`);
  }

  snoozeAlarm(index) {
    if (this.alarms[index].snoozeCount < 3) {
      let newTime = new Date(`1970-01-01T${this.alarms[index].time}`);
      newTime.setMinutes(newTime.getMinutes() + 5);
      this.alarms[index].time = newTime.toTimeString().split(" ")[0];
      this.alarms[index].snoozeCount++;
      console.log(`Alarm snoozed to ${this.alarms[index].time}`);
    } else {
      console.log("Snooze limit reached.");
    }
  }

  deleteAlarm(index) {
    this.alarms.splice(index, 1);
    console.log(`Alarm ${index} deleted`);
  }

  checkAlarms() {
    this.alarms.forEach((alarm, index) => {
      if (this.isAlarmTime(alarm)) {
        console.log("Alarm ringing!");
      }
    });
  }

  isAlarmTime(alarm) {
    const currentDay = this.currentTime.getDay();
    const currentTime = this.currentTime.toLocaleTimeString("en-US", {
      hour12: false,
    });
    return alarm.dayOfWeek === currentDay && alarm.time === currentTime;
  }
}

const myAlarmClock = new AlarmClock();
myAlarmClock.startClock();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log(`
    1. Add Alarm
    2. Snooze Alarm
    3. Delete Alarm
    4. Exit
    `);
  rl.question("Choose an option: ", (option) => {
    switch (option) {
      case "1":
        rl.question("Enter alarm time (HH:MM:SS): ", (time) => {
          rl.question(
            "Enter day of the week (0-6, where 0 is Sunday): ",
            (day) => {
              myAlarmClock.addAlarm(time, parseInt(day));
              showMenu();
            }
          );
        });
        break;
      case "2":
        rl.question("Enter alarm index to snooze: ", (index) => {
          myAlarmClock.snoozeAlarm(parseInt(index));
          showMenu();
        });
        break;
      case "3":
        rl.question("Enter alarm index to delete: ", (index) => {
          myAlarmClock.deleteAlarm(parseInt(index));
          showMenu();
        });
        break;
      case "4":
        rl.close();
        process.exit(0);
        break;
      default:
        console.log("Invalid option");
        showMenu();
    }
  });
}

showMenu();
