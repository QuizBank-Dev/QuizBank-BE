export const MAIL_TITLE = '[Quizbank] 이메일 인증 코드 발송 메일';
export const MAIL_CONTENT = (code: string) => `
<div class="body" style="background-color: #F7F8FA;">
<table cellspacing="0" cellpadding="0" border="0">
	<tbody>
		<tr><td height="64px" colspan="3"></td></tr>
		<tr>
			<td width="33.333%"></td>
			<td>
				<table bgcolor="#ffffff" width="560px" cellspacing="0" cellpadding="0" border="0">
					<tbody>
						<tr><td height="32px" colspan="2"></td></tr>
						<tr>
							<td width="32px"></td>
							<td>
								<!--<img height="30" width="120" alt="Quizbank Logo" src="">-->
								<font style="font-size: 32px; font-weight: 900; letter-spacing: -0.3px; color: #8A43EF;">Quizbank</font>
							</td>
						</tr>
						<tr><td height="32px" colspan="2"></td></tr>
						<tr><td colspan="2">
							<table bgcolor="#ffffff" width="100%" cellspacing="0" cellpadding="0" border="0">
								<tbody>
									<tr>
										<td width="32px"></td>
										<td>
											<font style="font-size: 16px; line-height: 1.5; color: #271065;">
												안녕하세요.<br>
												아래 인증번호를 Quizbank 회원가입 페이지에서 입력해주세요.<br>
												인증번호는 5분 후 만료되니, 반드시 5분 내에 입력하시기 바랍니다.
											</font>
										</td>
										<td width="32px"></td>
									</tr>
									<tr><td height="48px" colspan="3"></td></tr>
									<tr>
										<td width="32px"></td>
										<td>
											<table width="100%" cellspacing="0" cellpadding="0" border="0">
												<tbody>
													<tr>
														<td width="140px"></td>
														<td>
															<table width="100%" cellspacing="0" cellpadding="0" border="0">
																<tbody>
																	<tr>
																		<td align="center">
																			<strong style="font-size: 16px; line-height: 2; color: #4D3089;">인증번호</strong>
																		</td>
																	</tr>
																	<tr bgcolor="#F0F0FF">
																		<td align="center">
																			<strong style="font-size: 36px; line-height: 2; color: #8A43EF;">${code}</strong>
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
														<td width="140px"></td>
													</tr>
												</tbody>
											</table>
										</td>
										<td width="32px"></td>
									</tr>
									<tr><td height="48px" colspan="3"></td></tr>
								</tbody>
							</table>
						</td></tr>
					</tbody>
				</table>
			</td>
			<td width="33.333%"></td>
		</tr>
		<tr><td height="64px" colspan="3"></td></tr>
	</tbody>
</table>
</div>
`;
