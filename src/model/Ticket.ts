import mongoose, { Document, Schema } from 'mongoose';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'ANSWERED' | 'CLOSED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ITicket extends Document {
  user: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;

  subject: string;
  message: string;

  priority: TicketPriority;
  status: TicketStatus;

  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'ANSWERED', 'CLOSED'],
      default: 'OPEN',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket =
  mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', ticketSchema);

export default Ticket;
