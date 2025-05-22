export const MAIL_TITLE = '[Quizbank] 비밀번호 재설정';
export const MAIL_CONTENT = (url: string) => `
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
									해당 메일은 비밀번호 재설정을 위해 Quizbank에서 발송하는 메일입니다.<br>
									새로운 비밀번호를 설정하려면 "새로운 비밀번호 설정" 버튼을 클릭해주세요.
								</font>
							</td>
							<td width="32px"></td>
						</tr>
						<tr><td height="40px" colspan="3"></td></tr>
						<tr>
							<td width="32px"></td>
							<td>
								<table width="100%" cellspacing="0" cellpadding="0" border="0">
									<tbody>
										<tr>
											<td width="32px"></td>
											<td bgcolor="#8A43EF" style="border-radius: 8px;">
												<a href="${url}" target="_blank" style="display: block; text-align: center; line-height: 3; font-size: 18px; color: #ffffff; text-decoration: none; font-weight: 700;">
													새로운 비밀번호 설정
												</a>
											</td>
											<td width="32px"></td>
										</tr>
									</tbody>
								</table>
							</td>
							<td width="32px"></td>
						</tr>
						<tr><td height="32px" colspan="3"></td></tr>
						<tr>
							<td width="32px"></td>
							<td>
								<font style="font-size: 12px; line-height: 1.2; color: #73787e;">
									해당 링크는 60분 후 만료되니, 반드시 60분 이내에 비밀번호를 변경하시기 바랍니다.<br>
									본인이 요청한 메일이 아니라면 개인정보 보호를 위해 비밀번호를 재설정해주세요.
								</font>
							</td>
							<td width="32px"></td>
						</tr>
						<tr><td height="16px" colspan="3"></td></tr>
						<tr>
							<td width="32px"></td>
							<td height="1px" style="background-color: #d1d5db"></td>
							<td width="32px"></td>
						</tr>
						<tr><td height="16px" colspan="3"></td></tr>
						<tr>
							<td width="32px"></td>
							<td>
								<font style="font-size: 10px; line-height: 1.5; color: #73787e;">
									버튼을 눌러도 아무런 일이 일어나지 않나요?
									<a href="${url}" target="_blank" style="display: block; padding: 8px; background-color: #F0F0FF; margin-top: 4px;">${url}</a>
									위 링크를 복사한 후 브라우저에 붙여넣으세요.
								</font>
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
