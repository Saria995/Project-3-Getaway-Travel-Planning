import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TripForm from "components/FormModal";
import TripCard from "components/TripCard";
import "./main.scss";
import axios from "../../utils/API";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

export default class DemoApp extends React.Component {
  // ... (existing code)

  refreshTrips() {
    axios.getTrips().then((resp) => {
      this.setState({
        eventSources: resp.data[0].trip.map((e) => {
          let start = dayjs(e.start).tz("UTC").format("YYYY-MM-DD");
          let end = dayjs(e.end).tz("UTC").add(1, "day").format("YYYY-MM-DD");
          return {
            ...e,
            start: start,
            end: end,
          };
        }),
      });
    });
  }

  // ... (existing code)

  // get trip's data from database
  handleTrip = (id) => {
    axios
      .getOneTrip(id)
      .then((res) => {
        const dateStart = res.data.start;
        const start = dayjs(dateStart).tz("UTC").format("YYYY-MM-DD");
        const dateEnd = res.data.end;
        const end = dayjs(dateEnd).tz("UTC").format("YYYY-MM-DD");
        this.setState({
          id: res.data._id,
          title: res.data.title,
          location: res.data.location,
          start: start,
          end: end,
          description: res.data.description,
          guests: res.data.guests,
        });
      })
      .catch((err) => console.log(err));
  }

  // ... (existing code)

  handleSaveTrip = () => {
    if (
      this.state.title &&
      this.state.start &&
      this.state.end &&
      this.state.description
    ) {
      axios
        .saveTrip(this.state)
        .then(() => {
          this.refreshTrips();
          this.setState({
            showModal: false,
          });
        })
        .catch((err) => console.log(err));
      this.setState({
        title: "",
        location: "",
        start: new Date().getUTCHours(),
        end: new Date().getUTCHours(),
        description: "",
        errorTitle: "",
        errorLocation: "",
        errorStart: "",
        errorEnd: "",
        errorDescription: "",
        guests: [],
      });
    } else {
      this.setState({
        errorTitle: "*Please enter your trip name",
        errorLocation: "*Please enter your trip location",
        errorStart: "*Please enter the start date",
        errorEnd: "*Please enter the end date",
        errorDescription: "*Please enter the description",
      });
    }
  };
  render() {
    return (
      <div className='demo-app'>
        <TripForm show={this.state.showModal}
        {...this.state}
        close={this.handleCloseClick} 
        save={this.handleSaveTrip}  
        handleInputChange={this.handleInputChange}
        handleGuestsChange={this.handleGuestsChange} />
        <TripCard show={this.state.showCard}
        {...this.state}
        close={this.handleCloseClick}
        delete={this.handleDeleteClick}
        save={this.handleUpdateClick}
        handleInputChange={this.handleInputChange}
        handleGuestsChange={this.handleGuestsChange} />
        <div className='demo-app-top mb-4'>
          <button onClick={this.toggleWeekends} className="btn btn-dark">toggle weekends</button>&nbsp;
          <button onClick={this.gotoPast} className="btn btn-dark">go to a date in the past</button>&nbsp;
          (also, click a date/time to add an event)
        </div>
        <div className="demo-app-calendar">
          <FullCalendar
            defaultView="dayGridMonth"
            header={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
            }}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            ref={this.calendarComponentRef}
            weekends={this.state.calendarWeekends}
            events={this.state.eventSources}
            dateClick={this.handleDateClick}
            eventClick={this.handleEventClick}
          />
        </div>
      </div>
    );
  }
}