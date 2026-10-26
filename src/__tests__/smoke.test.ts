describe('Smoke Test - Môi trường kiểm thử Jest & React Testing Library', () => {
  it('chạy thành công kiểm tra cơ bản', () => {
    expect(1 + 1).toBe(2);
  });

  it('hỗ trợ DOM và matchers từ @testing-library/jest-dom', () => {
    const div = document.createElement('div');
    div.textContent = 'Mini Library';
    document.body.appendChild(div);

    expect(div).toBeInTheDocument();
    expect(div).toHaveTextContent('Mini Library');
    document.body.removeChild(div);
  });
});
