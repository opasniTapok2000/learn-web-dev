import re
from dataclasses import dataclass
from datetime import time as ClockTime


@dataclass
class Master:
    master_id: int


@dataclass
class Service:
    service_id: int


@dataclass
class Appoinment:
    id: int
    client_name: str
    master_id: int
    service_id: int
    time: str


# Учебные данные для самостоятельного запуска.
masters = {1: Master(master_id=1)}
services = {1: Service(service_id=1)}
appointments: list[Appoinment] = []

OPENING_TIME = ClockTime(8, 0)
CLOSING_TIME = ClockTime(20, 0)


def get_master(master_id: int) -> Master | None:
    return masters.get(master_id)


def get_service(service_id: int) -> Service | None:
    return services.get(service_id)


def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Appoinment | None:
    if not client_name or not client_name.strip():
        return None

    if master_id is None or service_id is None:
        return None

    if not time or re.fullmatch(r"[0-9]{2}:[0-9]{2}", time) is None:
        return None

    try:
        visit_time = ClockTime.fromisoformat(time)
    except ValueError:
        return None

    if not OPENING_TIME <= visit_time <= CLOSING_TIME:
        return None

    master = get_master(master_id)
    service = get_service(service_id)
    if master is None or service is None:
        return None

    appointment = Appoinment(
        id=len(appointments) + 1,
        client_name=client_name.strip(),
        master_id=master.master_id,
        service_id=service.service_id,
        time=time,
    )
    appointments.append(appointment)
    return appointment


if __name__ == "__main__":
    create_appointment("Иванова А.А.", 1, 1, "10:00")
    create_appointment("Петрова А.А.", 1, 1, "11:00")

    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)

    before = len(appointments)
    assert create_appointment("", 1, 1, "12:00") is None
    assert create_appointment("Сидорова А.А.", 1, 1, "00:00") is None
    print("Добавлено некорректных записей:", len(appointments) - before)
