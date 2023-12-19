import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { AttachFile } from "./AttachFile";

@Entity()
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    content!: string;
    
    @Column()
    creatorId!: number;

    @ManyToOne(() => User, (user) => user.boards)
    creator!: User;

    @OneToMany(() => AttachFile, (attachFile) => attachFile.board)
    attachFiles!: AttachFile;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}