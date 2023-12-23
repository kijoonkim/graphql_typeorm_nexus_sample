import { BaseEntity, Binary, Column, CreateDateColumn, Double, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "./Board";

@Entity()
export class AttachFile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    filename!: string;

    @Column()
    mimetype!: string;

    @Column()
    encoding!: string;
    
    @Column()
    boardId!: number;

    @ManyToOne(() => Board, (board) => board.attachFiles)
    board!: Board;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}