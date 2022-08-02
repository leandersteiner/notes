enum Status {
    Queued,
    Running,
    Failed,
}

fn main() {
    let status = Status::Failed;
    print_status(status);
}

fn print_status(status: Status) {
    match status {
        Status::Queued => println!("queued"),
        Status::Running => println!("running"),
        Status::Failed => println!("failed"),
    }
}
