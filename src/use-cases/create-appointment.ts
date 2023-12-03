import { AppointmentRepository } from '../repositories/appointment-repository';
import { Appointment } from './../entities/appointment';

interface CreateAppointmentRequest {
  customer: string,
  startsAt: Date,
  endsAt: Date,
}

type CreateAppointmentResponse = Appointment

export class CreateAppointment {
  constructor (
    private appointmentRepository: AppointmentRepository
  ) {}

  async execute({ customer, startsAt, endsAt }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const overlappingAppointment = await this.appointmentRepository.findOverlappingAppointment(startsAt, endsAt)
    if(overlappingAppointment) {
      throw new Error('Another appointment overlaps this appointment date')
    }
    
    const appointment = new Appointment({
      customer, 
      startsAt,
      endsAt,
    })

    await this.appointmentRepository.create(appointment)

    return appointment
  }  
}