import React from "react";
import { Modal, Button } from "react-bootstrap";
import Clock from "../clock";
import dayjs from "dayjs";

export default function TripCard(props) {
  function userDropdowns(users, guests) {
    const mappedUsers = users.map(user => {
      const selected = guests.find(guest => guest === user._id) ? true : false;
      return (
        <option value={user._id} selected={selected}>
          {user.username}
        </option>
      );
    });

    return mappedUsers;
  }

  return (
    <Modal show={props.show} id="trip">
      <Modal.Dialog>
        <Modal.Header closeButton onClick={props.close}>
          <Modal.Title>
            <i className="far fa-edit"></i> Edit Your Trip
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form autoComplete="off">
            <div className="form-group">
              <label htmlFor="title">Trip Name</label>
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Trip Name"
                value={props.title}
                name="title"
                onChange={props.handleInputChange}
              />
              <p className="error">{props.errorTitle}</p>
            </div>

            <div className="form-group">
              <label htmlFor="exampleFormControlSelect2">Guests</label>
              <select
                multiple
                className="form-control"
                id="exampleFormControlSelect2"
                onChange={props.handleGuestsChange}
              >
                {userDropdowns(props.users, props.guests)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                placeholder="Location"
                value={props.location}
                name="location"
                onChange={props.handleInputChange}
              />
              <p className="error">{props.errorLocation}</p>
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                className="form-control"
                id="start"
                value={props.start}
                name="start"
                onChange={props.handleInputChange}
              />
              <p className="error">{props.errorStart}</p>
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                className="form-control"
                id="end"
                value={props.end}
                name="end"
                onChange={props.handleInputChange}
              />
              <p className="error">{props.errorEnd}</p>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                rows="4"
                value={props.description}
                name="description"
                onChange={props.handleInputChange}
              ></textarea>
              <p className="error">{props.errorDescription}</p>
            </div>
          </form>
          <div>
            {dayjs(props.start).isSameOrAfter(dayjs()) && (
              <h4>
                <i className="far fa-clock"></i> Trip Start
              </h4>
            )}

            {dayjs(props.start).isSameOrAfter(dayjs()) && (
              <Clock deadline={props.start} />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={props.delete}
            variant="danger"
            className="deleteEvent"
          >
            Delete Trip
          </Button>
          <Button
            onClick={props.save}
            variant="primary"
            className="saveEvent"
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  );
}
