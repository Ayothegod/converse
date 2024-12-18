class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  // error: boolean
  
  constructor(statusCode: number, data: any, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    // this.error = statusCode >= 400
  }
}

export { ApiResponse };
